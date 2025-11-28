import { Activity } from "../Entity/Activity";

export class ActivityConverter {
    static toResponse(activity: Activity) {
        return {
            ...activity,
            content: typeof activity.content === "string" ? JSON.parse(activity.content) : activity.content,
            gallery: typeof activity.gallery === "string" ? JSON.parse(activity.gallery) : activity.gallery,
        };
    }

    static toListResponse(activities: Activity[]) {
        return activities.map(b => ActivityConverter.toResponse(b));
    }
}
