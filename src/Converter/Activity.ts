import { Activity } from "../Entity/Activity";

export class ActivityConverter {
    static toResponse(activity: Activity) {
        let parsedVideos: string[] = [];

        if (activity.video_urls) {
            parsedVideos = typeof activity.video_urls === "string"
                ? JSON.parse(activity.video_urls)
                : activity.video_urls;
        }

        const fullVideoUrls = Array.isArray(parsedVideos)
            ? parsedVideos.map(path => `${process.env.R2_PUBLIC_URL}/${path}`)
            : [];

        return {
            ...activity,
            content: typeof activity.content === "string" ? JSON.parse(activity.content) : activity.content,
            gallery: typeof activity.gallery === "string" ? JSON.parse(activity.gallery) : activity.gallery,
            video_urls: fullVideoUrls,
            begin: activity.begin ? new Date(activity.begin).toISOString().split('T')[0] : null,
            end: activity.end ? new Date(activity.end).toISOString().split('T')[0] : null,
        };
    }

    static toListResponse(activities: Activity[]) {
        return activities.map(b => ActivityConverter.toResponse(b));
    }
}
