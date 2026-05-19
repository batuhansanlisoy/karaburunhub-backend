import { Organization as OrganizationEntity } from "../Entity/Organization";

export class Organization {
    static toResponse(org_data: OrganizationEntity) {

        let parsedVideos: string[] = [];

        if (org_data.video_urls) {
            parsedVideos = typeof org_data.video_urls === "string"
                ? JSON.parse(org_data.video_urls)
                : org_data.video_urls;
        }

        const fullVideoUrls = Array.isArray(parsedVideos)
            ? parsedVideos.map(path => `${process.env.R2_PUBLIC_URL}/${path}`)
            : [];

        return {
            ...org_data,
            content: typeof org_data.content === "string" ? JSON.parse(org_data.content) : org_data.content,
            gallery: typeof org_data.gallery === "string" ? JSON.parse(org_data.gallery) : org_data.gallery,
            video_urls: fullVideoUrls
        };
    }

    static toListResponse(org_data: OrganizationEntity[]) {
        return org_data.map(b => Organization.toResponse(b));
    }
}
