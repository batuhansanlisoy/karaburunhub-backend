import db, { Knex } from "../db/knex";
import { Organization } from "../Entity/Organization";

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

    async create(organization: Partial<Organization>, trx?: Knex.Transaction): Promise<number[]> {
        const query = trx ? trx(this.tableName) : db(this.tableName);
        return query.insert(organization);
    }

    async update(id: number, payload: Partial<Organization>): Promise<number> {
        const dummy: any = { ...payload };

        if (payload.cover !== undefined) {
            dummy.cover = payload.cover ? JSON.stringify(payload.cover) : null;
        }
        
        if (payload.gallery !== undefined) {
            dummy.gallery = payload.gallery ? JSON.stringify(payload.gallery) : null;
        }

        if (payload.content !== undefined) {
            const existing = await db(this.tableName).select('content').where({ id }).first();
            let mergedContent: Record<string, any> = {};

            if (existing?.content) {
                try {
                    mergedContent = JSON.parse(existing.content);
                } catch (e) {
                    console.warn('Content parse hatası, sıfırdan başlıyoruz', e);
                }
            }

            // Yeni gelen content'i object yap
            let newContent: Record<string, any> = {};
            if (typeof payload.content === 'string') {
                try {
                    newContent = JSON.parse(payload.content);
                } catch (e) {
                    console.warn('Yeni content parse hatası', e);
                }
            } else if (typeof payload.content === 'object') {
                newContent = payload.content;
            }

            // Merge et
            mergedContent = { ...mergedContent, ...newContent };
            dummy.content = JSON.stringify(mergedContent);
        }

        // undefined alanları update'ten çıkar
        Object.keys(dummy).forEach(key => {
            if (dummy[key] === undefined) delete dummy[key];
        });

        return db(this.tableName).where({ id }).update(dummy);
    }

    async del(id: number, trx?:  Knex.Transaction): Promise<number[]> {
        if (trx) {
            return trx(this.tableName).where({ id }).del();
        }
        return db(this.tableName).where({ id }).del();
    }
}
