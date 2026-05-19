import { Place } from "../Entity/Place";

export class PlaceConverter {
    static toResponse(place: Place) {

        let parsedVideos: string[] = [];

        if (place.video_urls) {
            parsedVideos = typeof place.video_urls === "string"
                ? JSON.parse(place.video_urls)
                : place.video_urls;
        }

        const fullVideoUrls = Array.isArray(parsedVideos)
            ? parsedVideos.map(path => `${process.env.R2_PUBLIC_URL}/${path}`)
            : [];

        return {
            ...place,
            content: typeof place.content === "string" ? JSON.parse(place.content) : place.content,
            gallery: typeof place.gallery === "string" ? JSON.parse(place.gallery) : place.gallery,
            video_urls: fullVideoUrls
        };
    }

    static toListResponse(places: Place[]) {
        return places.map(b => PlaceConverter.toResponse(b));
    }
}
