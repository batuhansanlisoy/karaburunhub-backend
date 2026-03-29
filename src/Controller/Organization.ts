// src/controllers/UserController.ts
import { Request, Response } from "express";
import { Organization } from "../Entity/Organization";
import { OrganizationService } from "../Service/Organization";
import { Organization as Converter } from "../Converter/Organization";
import { DistanceActivityOrganizationService } from "../Service/Distance/ActivityOrganization";
import { DistanceBeachOrganizationService } from "../Service/Distance/BeachOrganization";
import { DistancePlaceOrganizationService } from "../Service/Distance/PlaceOrganization";
import { HighlightedOrganizationService } from "~/Service/HighlightedOrganization";

const service = new OrganizationService();
const serviceActivityDistance = new DistanceActivityOrganizationService();
const serviceBeachDistance = new DistanceBeachOrganizationService();
const servicePlaceDistance = new DistancePlaceOrganizationService();
const serviceHihglightedOrganization = new HighlightedOrganizationService();

export const show = async (req: Request, res: Response) => {
    res.render("organization/index", {
        title: "İşletmeler",
        activePage: "organization",
        page: "organization"
    });
};

export const list = async (req: Request, res: Response) => {
    const category_id = req.query.category_id ? Number(req.query.category_id) : undefined;
    const village_id  = req.query.village_id ? Number(req.query.village_id) : undefined;
    const highlight = req.query.highlight !== undefined ? req.query.highlight === 'true' : undefined;

    try {
        const organizations: Organization[] = await service.list(category_id, village_id, highlight);
        const responce = Converter.toListResponse(organizations);

        res.json(responce);
    } catch (err) {
        console.error(err);
        res.status(500).send("Organizasyon listesi alınamadı");
    }
};

export const create = async (req: Request, res: Response) => {
    const category_id = req.body.category_id;
    const village_id  = req.body.village_id;
    const name        = req.body.name;
    const email       = req.body.email;
    const phone       = req.body.phone;
    const address     = req.body.address;
    const website     = req.body.website;
    const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;
    const items       = req.body.item_ids;

    if (!name || !address) {
        return res.status(400).send("Boş Alanlar var");
    }

    const organization: Partial<Organization> = {
        category_id, village_id, name, email, phone,
        address, website, latitude, longitude
    };

    try {
        const result = await service.create(organization, items);
        res.status(201).json({ success: true, message: "Organization Created", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || "Organization could not be created" });
    }
};

export const update = async (req: Request, res: Response) => {
    const id          = Number(req.params.id);
    const category_id = req.body.category_id;
    const village_id  = req.body.village_id;
    const name        = req.body.name;
    const email       = req.body.email;
    const phone       = req.body.phone;
    const address     = req.body.address;
    const website     = req.body.website;
    const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;

    const organization: Partial<Organization> = { 
        category_id, village_id, name, email,
        phone, address, website, latitude, longitude
    };

    try {
        const result = await service.update(id, organization);
        return res.json({ result });
    } catch(err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err});
    }
}

export const highligt = async (req: Request, res: Response) => {
    const organization_id = Number(req.params.id);
    const value = req.body.value;

    try {
        const result = await service.patch(organization_id, "highlight", value);

        if (result === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "İşletme Bulunamadı." 
            });
        }

        const organization = await service.single(organization_id);

        return res.status(200).json({ 
            success: true, 
            message: "Öne çıkarma durumu güncellendi.",
            data: organization
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || "Highlight error"})
    }
}

export const uploadPhoto = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    
    const files: any = req.files;
    let cover: {url: string, filename: string, path: string} | undefined;

    if (files && files.cover && files.cover[0]) {
        const file = files.cover[0];

        cover = {
            url: `/upload/organization/${id}/${file.filename}`,
            filename: file.filename,
            path: `/upload/organization/${id}`
        };
    }

    const gallery: string[] | undefined = files?.['gallery[]']
        ? files['gallery[]'].map((f: any) => `/upload/organization/${id}/${f.filename}`)
        : undefined;
    
    const organization: Partial<Organization> = { cover, gallery };

    try {
        const result = await service.update(id, organization);
        return res.json({ result });
    } catch(err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err});
    }
}

export const del = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        const status = await service.del(id);
        return res.json({ deletedRows: status });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Silinemedi", error: err.message || err });
    }
};

export const nearestActivity = async (req: Request, res: Response) => {
    const organizationId = Number(req.params.id);

    try {
        const distances = await serviceActivityDistance.list(undefined, organizationId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || err });
    }
}

export const nearestBeaches = async (req: Request, res: Response) => {
    const organizationId = Number(req.params.id);

    try {
        const distances = await serviceBeachDistance.list(undefined, organizationId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || err });
    }
}

export const nearestPlaces = async (req: Request, res: Response) => {
    const organizationId = Number(req.params.id);

    try {
        const distances = await servicePlaceDistance.list(organizationId, undefined);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || err });
    }
}
