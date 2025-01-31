const videoModel = (video) => {
    return {
        videoId: video.videoId,
        title: video.title,
        channelTitle: video.channelTitle,
        thumbnailUrl: video.thumbnailUrl,
        publishedAt: video.publishedAt,
        done: video.done
    }
}