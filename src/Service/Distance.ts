import { getDistance } from "../shared/geo/distance";

import { ActivityRepository } from "../Repository/Activity";
import { BeachRepository } from "../Repository/Beach";
import { PlaceRepository } from "../Repository/Place";
import { OrganizationRepository } from "../Repository/Organization";

import { DistanceActivityBeachService } from "./Distance/ActivityBeach";
import { DistanceActivityPlaceService } from "./Distance/ActivityPlace";
import { DistanceActivityOrganizationService } from "./Distance/ActivityOrganization";
import { DistanceBeachPlaceService } from "./Distance/BeachPlace";
import { DistanceBeachOrganizationService } from "./Distance/BeachOrganization";
import { DistancePlaceOrganizationService } from "./Distance/PlaceOrganization";

export class LocationDistanceOrchestrator {
    private activityRepo = new ActivityRepository();
    private beachRepo = new BeachRepository();
    private placeRepo = new PlaceRepository();
    private orgRepo = new OrganizationRepository();

    private activityBeachDistance = new DistanceActivityBeachService();
    private activityPlaceDistance = new DistanceActivityPlaceService();
    private activityOrgDistance = new DistanceActivityOrganizationService();

    private beachPlaceDistance = new DistanceBeachPlaceService();
    private beachOrgDistance = new DistanceBeachOrganizationService();
    private placeOrgDistance = new DistancePlaceOrganizationService();

    /**
     * Ortak mesafe hesaplama helper'ı
     */
    private async calculateBatch<T>(
        items: T[],
        getLatLng: (item: T) => [number | null | undefined, number | null | undefined],
        save: (distance: number, item: T) => Promise<void>,
        selfLatitude: number,
        selfLongitude: number
    ): Promise<void> {
        for (const item of items) {
            const [lat, lng] = getLatLng(item);
            if (lat == null || lng == null) continue;

            const d = getDistance(selfLatitude, selfLongitude, lat, lng);
            await save(Math.round(d.meters), item);
        }
    }

    /**
     * Activity oluşturulduğunda
     */
    async onActivityCreated(
        activityId: number,
        latitude: number | null,
        longitude: number | null
    ): Promise<void> {
        if (latitude == null || longitude == null) return;

        const [beaches, places, organizations] = await Promise.all([
            this.beachRepo.getAll(),
            this.placeRepo.getAll(),
            this.orgRepo.getAll(),
        ]);

        await this.calculateBatch(
            beaches,
            b => [b.latitude, b.longitude],
            (distance, beach) =>
                this.activityBeachDistance.create({
                    activity_id: activityId,
                    beach_id: beach.id,
                    distance_meter: distance,
                }),
            latitude,
            longitude
        );

        await this.calculateBatch(
            places,
            p => [p.latitude, p.longitude],
            (distance, place) =>
                this.activityPlaceDistance.create({
                    activity_id: activityId,
                    place_id: place.id,
                    distance_meter: distance,
                }),
            latitude,
            longitude
        );

        await this.calculateBatch(
            organizations,
            o => [o.latitude, o.longitude],
            (distance, org) =>
                this.activityOrgDistance.create({
                    activity_id: activityId,
                    organization_id: org.id,
                    distance_meter: distance,
                }),
            latitude,
            longitude
        );
    }

    async onBeachCreated(
        beachId: number,
        latitude: number | null,
        longitude: number | null
    ): Promise<void> {
        if (latitude == null || longitude == null) return;

        const [activities, places, organizations] = await Promise.all([
            this.activityRepo.getAll(),
            this.placeRepo.getAll(),
            this.orgRepo.getAll(),
        ]);

        await this.calculateBatch(
            activities,
            a => [a.latitude, a.longitude],
            (distance, activity) =>
                this.activityBeachDistance.create({
                    beach_id: beachId,
                    activity_id: activity.id,
                    distance_meter: distance,
                }),
            latitude,
            longitude
        );

        await this.calculateBatch(
            places,
            p => [p.latitude, p.longitude],
            (distance, place) =>
                this.beachPlaceDistance.create({
                    beach_id: beachId,
                    place_id: place.id,
                    distance_meter: distance,
                }),
            latitude,
            longitude
        );

        await this.calculateBatch(
            organizations,
            o => [o.latitude, o.longitude],
            (distance, org) =>
                this.beachOrgDistance.create({
                    beach_id: beachId,
                    organization_id: org.id,
                    distance_meter: distance,
                }),
            latitude,
            longitude
        );
    }

    async onPlaceCreated(
        placeId: number,
        latitude: number | null,
        longitude: number | null
    ): Promise<void> {
        if (latitude == null || longitude == null) return;

        const [activities, beaches, organizations] = await Promise.all([
            this.activityRepo.getAll(),
            this.beachRepo.getAll(),
            this.orgRepo.getAll(),
        ]);

        await this.calculateBatch(
            activities,
            a => [a.latitude, a.longitude],
            (distance, activity) =>
                this.activityPlaceDistance.create({
                    place_id: placeId,
                    activity_id: activity.id,
                    distance_meter: distance,
                }),
            latitude,
            longitude
        );

        await this.calculateBatch(
            beaches,
            p => [p.latitude, p.longitude],
            (distance, beach) =>
                this.beachPlaceDistance.create({
                    beach_id: beach.id,
                    place_id: placeId,
                    distance_meter: distance,
                }),
            latitude,
            longitude
        );

        await this.calculateBatch(
            organizations,
            o => [o.latitude, o.longitude],
            (distance, org) =>
                this.placeOrgDistance.create({
                    place_id: placeId,
                    organization_id: org.id,
                    distance_meter: distance,
                }),
            latitude,
            longitude
        );
    }
}
