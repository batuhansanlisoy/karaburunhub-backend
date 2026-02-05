import { Category } from "../../Entity/Organization/Category";

export class OrganizationCategoryConverter {
    static toResponse(orgCat: Category) {
        return {
            ...orgCat,
            extra: typeof orgCat.extra === "string" ? JSON.parse(orgCat.extra) : orgCat.extra,
        };
    }

    static toListResponse(orgCats: Category[]) {
        return orgCats.map(b => OrganizationCategoryConverter.toResponse(b));
    }
}
