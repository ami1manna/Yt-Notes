from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import Optional
from urllib.parse import urlparse, parse_qs
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import json
import os
import base64
import html

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    video_url: str
    access_token: str

    @validator('video_url')
    def validate_youtube_url(cls, v):
        try:
            parsed = urlparse(v)
            if parsed.netloc not in ['www.youtube.com', 'youtube.com', 'youtu.be']:
                raise ValueError("Not a valid YouTube URL")
        except Exception:
            raise ValueError("Invalid URL format")
        return v

def extract_video_id(url: str) -> Optional[str]:
    if 'youtu.be' in url:
        return url.split('/')[-1]
    
    parsed_url = urlparse(url)
    if 'youtube.com' in parsed_url.netloc:
        query_params = parse_qs(parsed_url.query)
        return query_params.get('v', [None])[0]
    
    return None

def get_caption_content(youtube, caption_id: str) -> str:
    try:
        caption_response = youtube.captions().download(
            id=caption_id,
            tfmt='srt'
        ).execute()
        
        caption_content = base64.b64decode(caption_response).decode('utf-8')
        lines = caption_content.split('\n')
        text_lines = []
        current_line = 4
        
        while current_line < len(lines):
            if lines[current_line].strip():
                clean_text = html.unescape(lines[current_line].strip())
                text_lines.append(clean_text)
            current_line += 4
            
        return ' '.join(text_lines)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to download caption content: {str(e)}"
        )

@app.get("/api")
def read_root():
    return {
        "message": "YouTube Caption API",
        "version": "1.0",
        "status": "operational"
    }

@app.post("/api/get-transcript")
async def get_transcript(request: VideoRequest):
    try:
        video_id = extract_video_id(request.video_url)
        if not video_id:
            raise HTTPException(
                status_code=400,
                detail="Could not extract video ID from URL"
            )

        credentials = Credentials(
            token=request.access_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.environ.get('GOOGLE_CLIENT_ID'),
            client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
            scopes=['https://www.googleapis.com/auth/youtube.force-ssl']
        )

        youtube = build('youtube', 'v3', credentials=credentials)

        try:
            captions_response = youtube.captions().list(
                part='snippet',
                videoId=video_id
            ).execute()

            if not captions_response.get('items'):
                raise HTTPException(
                    status_code=404,
                    detail="No captions available for this video"
                )

            caption_id = captions_response['items'][0]['id']
            transcript_text = get_caption_content(youtube, caption_id)

            return {
                "success": True,
                "video_id": video_id,
                "transcript": transcript_text
            }

        except Exception as e:
            raise HTTPException(
                status_code=404,
                detail=f"Failed to fetch captions: {str(e)}"
            )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )