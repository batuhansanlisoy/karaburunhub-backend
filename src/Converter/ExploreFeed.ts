import { ExploreFeed } from "../Entity/ExploreFeed";

export class ExploreFeedConverter {
    static toResponse(data: ExploreFeed) {
        let videoUrl = data.video_url;

        if (videoUrl) {
            videoUrl = `${process.env.R2_PUBLIC_URL}/${videoUrl}`;
        }

        return {
            ...data,
            video_url: videoUrl,
        };
    }

    static toListResponse(entity: ExploreFeed[]) {
        return entity.map(b => ExploreFeedConverter.toResponse(b));
    }
}