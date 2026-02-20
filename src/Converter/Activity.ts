import { Activity } from "../Entity/Activity";

export class ActivityConverter {
    static toResponse(activity: Activity) {
        return {
            ...activity,
            content: typeof activity.content === "string" ? JSON.parse(activity.content) : activity.content,
            gallery: typeof activity.gallery === "string" ? JSON.parse(activity.gallery) : activity.gallery,
            begin: activity.begin ? new Date(activity.begin).toISOString().split('T')[0] : null,
            end: activity.end ? new Date(activity.end).toISOString().split('T')[0] : null,
        };
    }

    static toListResponse(activities: Activity[]) {
        return activities.map(b => ActivityConverter.toResponse(b));
    }
}
