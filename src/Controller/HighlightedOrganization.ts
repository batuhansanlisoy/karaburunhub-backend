import { Request, Response } from "express";
import { HighlightedOrganizationService } from "../Service/HighlightedOrganization";
import { HighlightedOrganization } from "../Entity/HighlightedOrganization";
import { HighlightedOrganization as Converter } from "../Converter/HighligtedOrganization";

const service = new HighlightedOrganizationService();

export const list = async(req: Request, res: Response) => {
    const organization_id = req.query.organization_id ? Number(req.query.organization_id) : undefined;
    const org_info = req.query.org_info === "true"; 

    try {
        const featured = await service.list(organization_id, org_info);
        const response = Converter.toListResponse(featured);

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send("Öne Çıkarılan Listesi Alınamadı");
    }
};

export const create = async (req: Request, res: Response) => {
    const organization_id = req.body.organization_id;
    const payload: Partial<HighlightedOrganization> = { organization_id };

    try {
        const result = await service.create(payload);
        res.status(201).json({ success: true, message: "İşletme Öne Çıkarıldı", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || "İşletme Öne Çıkarma İşlemi Hatası" });
    }
};
