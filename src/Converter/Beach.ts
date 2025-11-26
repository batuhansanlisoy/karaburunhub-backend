import { Beach } from "../Entity/Beach";

export class BeachConverter {
    static toResponse(beach: Beach) {
        return {
            ...beach,
            extra: typeof beach.extra === "string" ? JSON.parse(beach.extra) : beach.extra,
            gallery: typeof beach.gallery === "string" ? JSON.parse(beach.gallery) : beach.gallery,
        };
    }

    static toListResponse(beaches: Beach[]) {
        return beaches.map(b => BeachConverter.toResponse(b));
    }
}
