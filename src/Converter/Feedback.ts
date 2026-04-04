import { Feedback } from "../Entity/Feedback";

export class FeedbackConverter {
    static toResponse(entry: Feedback) {
        return {
            ...entry,
            content: typeof entry.content === "string" ? JSON.parse(entry.content) : entry.content,
        };
    }

    static toListResponse(entries: Feedback[]) {
        return entries.map(item => FeedbackConverter.toResponse(item));
    }
}
