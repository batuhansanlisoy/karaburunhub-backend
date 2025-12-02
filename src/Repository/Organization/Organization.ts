import db from "../../db/knex";
import { Organization } from "../../Entity/Organization/Organization";

export class OrganizationRepository {
    private tableName = "organization";

    async single(id: number): Promise<Organization> {
        const org = await db(this.tableName).where({ id }).first();
        if (org?.cover && typeof org.cover === "string") {
            org.cover = JSON.parse(org.cover); // artık servis tarafında cover bir obje
        }
        return org;
    }

    async getAll(): Promise<Organization[]> {
        return db(this.tableName).select(
            "organization.id",
            "organization.category_id",
            "organization.name",
            "organization.email",
            "organization.phone",
            "organization.content",
            "organization.website",
            "organization.cover",
            "organization.gallery",
            "organization.address",
            "organization.latitude",
            "organization.longitude",
            "organization.created_at",
            "organization.updated_at",
            "organization_category.name as category_name"
        )
        .leftJoin("organization_category", "organization.category_id", "organization_category.id");
    }

    async getByCategoryId(category_id: number): Promise<Organization[]> {
        return db(this.tableName).where("category_id", category_id);
    }

    async create(organization: Partial<Organization>): Promise<number[]> {
        return db(this.tableName).insert(organization);
    }

    async del(id: number, trx?: any): Promise<number[]> {
        if (trx) {
            return trx(this.tableName).where({ id }).del();
        }
        return db(this.tableName).where({ id }).del();
    }
}
