import { RequestBusiness } from "../Entity/RequestBusiness";

export class RequestBusinessConverter {
    static toResponse(entry: RequestBusiness) {
        return {
            ...entry,
            sender: typeof entry.sender === "string" ? JSON.parse(entry.sender) : entry.sender,
            business: typeof entry.business === "string" ? JSON.parse(entry.business) : entry.business,
        };
    }

    static toListResponse(entities: RequestBusiness[]) {
        return entities.map(b => RequestBusinessConverter.toResponse(b));
    }
}
