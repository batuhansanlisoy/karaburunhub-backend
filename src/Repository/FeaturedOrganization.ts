import db from "../db/knex";
import { FeaturedOrganization } from "../Entity/FeaturedOrganization";

export class FeaturedOrganizationRepository {
    private tableName = "widget_featured_organization";

    async getAll(orgId?: number, orgInfo: boolean = false): Promise<any[]> {
        let query = db(this.tableName).select(`${this.tableName}.*`);

        if (orgInfo) {
            query.select("organization.*",
                "organization.created_at as org_created_at",
                "organization.updated_at as org_updated_at",
                `${this.tableName}.id as widget_featured_organization_id`)
                .join("organization", `${this.tableName}.organization_id`, "organization.id");
        }

        if (orgId) {
            query.where(`${this.tableName}.organization_id`, orgId);
        }

        const results = await query;

        return results.map(row => {
            if (!orgInfo) return row;

            const { 
                widget_featured_organization_id, organization_id, active,
                created_at, updated_at, org_created_at, org_updated_at, ...orgData
            } = row;

            return {
                id: widget_featured_organization_id,
                organization_id: organization_id,
                active: active,
                created_at: created_at,
                updated_at: updated_at,
                organization: {
                    ...orgData,
                    id: organization_id,
                    created_at: org_created_at,
                    updated_at: org_updated_at
                }
            };
        });
    }

    async create(payload: Partial<FeaturedOrganization>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}