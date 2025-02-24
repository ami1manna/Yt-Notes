from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/transcript/{video_id}")
async def get_transcript(video_id: str):
    try:
        # Try multiple language options
        languages_to_try = [
            None,  # First try default
            ['en'],  # Then try English
            ['en-US'],  # Then US English
            ['en-GB'],  # Then British English
            ['a.en']  # Then auto-generated English
        ]
        
        transcript_list = None
        last_error = None
        
        # Try each language option
        for lang in languages_to_try:
            try:
                if lang is None:
                    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
                else:
                    transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=lang)
                if transcript_list:
                    break
            except Exception as e:
                last_error = str(e)
                continue
        
        if not transcript_list:
            # Get list of available transcripts
            try:
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
                available_transcripts = [t.language_code for t in transcript_list]
                return {
                    "error": "Could not get English transcript",
                    "available_languages": available_transcripts
                }
            except:
                raise HTTPException(
                    status_code=404,
                    detail=f"No transcripts available. Last error: {last_error}"
                )
        
        return {
            "video_id": video_id,
            "transcript": transcript_list,
            "full_text": " ".join(item['text'] for item in transcript_list)
        }
        
    except Exception as e:
        error_msg = str(e)
        if "not exist" in error_msg.lower():
            raise HTTPException(status_code=404, detail="Video not found")
        elif "private video" in error_msg.lower():
            raise HTTPException(status_code=403, detail="This is a private video")
        else:
            raise HTTPException(status_code=500, detail=str(e))