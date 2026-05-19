import { LocalProducer } from "../Entity/LocalProducer";

export class LocalProducerConverter {
    static toResponse(entry: LocalProducer) {
        let parsedVideos: string[] = [];

        if (entry.video_urls) {
            parsedVideos = typeof entry.video_urls === "string"
                ? JSON.parse(entry.video_urls)
                : entry.video_urls;
        }

        const fullVideoUrls = Array.isArray(parsedVideos)
            ? parsedVideos.map(path => `${process.env.R2_PUBLIC_URL}/${path}`)
            : [];

        return {
            ...entry,
            extra: typeof entry.extra === "string" ? JSON.parse(entry.extra) : entry.extra,
            gallery: typeof entry.gallery === "string" ? JSON.parse(entry.gallery) : entry.gallery,
            video_urls: fullVideoUrls
        };
    }

    static toListResponse(data: LocalProducer[]) {
        return data.map(b => LocalProducerConverter.toResponse(b));
    }
}
