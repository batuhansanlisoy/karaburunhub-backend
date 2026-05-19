import { Beach } from "../Entity/Beach";

export class BeachConverter {
    static toResponse(beach: Beach) {
        let parsedVideos: string[] = [];

        if (beach.video_urls) {
            parsedVideos = typeof beach.video_urls === "string" 
                ? JSON.parse(beach.video_urls) 
                : beach.video_urls;
        }

        const fullVideoUrls = Array.isArray(parsedVideos)
            ? parsedVideos.map(path => `${process.env.R2_PUBLIC_URL}/${path}`)
            : [];

        return {
            ...beach,
            extra: typeof beach.extra === "string" ? JSON.parse(beach.extra) : beach.extra,
            gallery: typeof beach.gallery === "string" ? JSON.parse(beach.gallery) : beach.gallery,
            video_urls: fullVideoUrls,
        };
    }

    static toListResponse(beaches: Beach[]) {
        return beaches.map(b => BeachConverter.toResponse(b));
    }
}