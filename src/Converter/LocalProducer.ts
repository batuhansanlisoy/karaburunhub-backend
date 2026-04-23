import { LocalProducer } from "../Entity/LocalProducer";

export class LocalProducerConverter {
    static toResponse(entry: LocalProducer) {
        return {
            ...entry,
            extra: typeof entry.extra === "string" ? JSON.parse(entry.extra) : entry.extra,
            gallery: typeof entry.gallery === "string" ? JSON.parse(entry.gallery) : entry.gallery,
        };
    }

    static toListResponse(data: LocalProducer[]) {
        return data.map(b => LocalProducerConverter.toResponse(b));
    }
}
