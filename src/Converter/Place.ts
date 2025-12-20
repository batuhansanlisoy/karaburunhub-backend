import { Place } from "../Entity/Place";

export class PlaceConverter {
    static toResponse(place: Place) {
        return {
            ...place,
            content: typeof place.content === "string" ? JSON.parse(place.content) : place.content,
            gallery: typeof place.gallery === "string" ? JSON.parse(place.gallery) : place.gallery,
        };
    }

    static toListResponse(places: Place[]) {
        return places.map(b => PlaceConverter.toResponse(b));
    }
}
