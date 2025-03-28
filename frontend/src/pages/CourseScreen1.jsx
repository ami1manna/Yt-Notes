import React, { useContext, useEffect, useState, useMemo } from 'react';
import { PlaylistContext } from '../context/PlaylistsContext';
import { useParams } from 'react-router-dom';

const CourseScreen = () => {
    const { userPlaylists } = useContext(PlaylistContext);
    const { playlistId } = useParams();

    // Memoizing selectedPlaylist to avoid unnecessary re-renders
    const selectedPlaylist = useMemo(() => userPlaylists?.[playlistId] || null, [userPlaylists, playlistId]);

    const [displaySection, setDisplaySection] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [sectionData, setSectionData] = useState({});
    const [videoData, setVideoData] = useState([]);

    // Update displaySection and selectedVideoId only when selectedPlaylist changes
    useEffect(() => {
        if (selectedPlaylist) {
            setDisplaySection(selectedPlaylist.displaySection);
            setSelectedVideoId(selectedPlaylist.selectedVideoId);
            console.log(`Display Section: ${selectedPlaylist.displaySection}`);
        }
    }, [selectedPlaylist]);

    // Fetch section-wise or ordered video data
    useEffect(() => {
        if (!selectedPlaylist || !selectedPlaylist.videos) return;

        if (!displaySection) {
            console.log(`Total Videos: ${selectedPlaylist.videoOrder.length}`);
            const videoData = selectedPlaylist.videoOrder.map(videoId => selectedPlaylist.videos[videoId]);
            console.log(videoData);
            setVideoData(videoData);
        } else {
            const sec = selectedPlaylist.sections;
            if (!sec) return;

            // Set section data efficiently
            const newSectionData = Object.entries(sec).reduce((acc, [key, section]) => {
                acc[key] = {
                    ...section,
                    videos: section.videoIds?.map(videoId => selectedPlaylist.videos?.[videoId]) || [],
                };
                return acc;
            }, {});

            setSectionData(newSectionData);

            // Debugging output
            console.log("Fetched Sections:");
            Object.entries(newSectionData).forEach(([key, section]) => {
                console.log(`Section: ${section.name}, Video IDs: ${section.videoIds.join(", ")}`);
            });
        }
    }, [displaySection, selectedPlaylist]); // ✅ Runs only when necessary

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{selectedPlaylist?.playlistId}</h2>
            <p className="text-gray-600">Display Section: {displaySection.toString()}</p>

            {/* Display videos based on displaySection */}
            {displaySection ? (
                // Render Sections with Videos
                Object.entries(sectionData).map(([sectionId, section]) => (
                    <div key={sectionId} className="mb-6 border-b pb-4">
                        <h3 className="text-xl font-semibold mb-2">{section.name}</h3>
                        <ul className="list-disc pl-5">
                            {section.videos.map((video, index) => (
                                <li key={video.videoId || index} className="text-blue-600 hover:underline">
                                    <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                                        {video.title || "Untitled Video"}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                // Render Videos Sequentially
                <ul className="list-decimal pl-5">
                    {videoData.map((video, index) => (
                        <li key={video.videoId || index} className="mb-2 text-blue-600 hover:underline">
                            <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                                {video.title || "Untitled Video"}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CourseScreen;
