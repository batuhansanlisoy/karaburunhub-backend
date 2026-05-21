import { Request, Response } from "express";
import { RequestBusinessService } from "../Service/requestBusiness";
import { RequestBusiness } from "~/Entity/RequestBusiness";
import { RequestBusinessConverter } from "~/Converter/RequestBusiness";

const service = new RequestBusinessService();

export const show = async (req: Request, res: Response) => {
    res.render("request/business/index", {
    title: "İş Ortaklık Talepleri",
    activePage: "request/business",
    page: "request/business"
    });
};

export const showForm = async (req: Request, res: Response) => {
    res.render("request/business/form/create", {
    title: "Partnerlik Başvurusu",
    layout: false,
    });
};

export const list = async (req: Request, res: Response) => {
    const is_read = req.query.is_read !== undefined ? req.query.is_read === 'true' : undefined;
    const status = req.query.status as "pending" | "approved" | "rejected" | undefined;
    
    try {
        const request_businness: RequestBusiness[] = await service.list(is_read, status);
        const response = RequestBusinessConverter.toListResponse(request_businness);

        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    const requst_business_id = Number(req.params.id);

    try {
        await service.patch(requst_business_id, "is_read", true);

        return res.status(200).json({ 
            success: true, 
            message: "Okundu Olarak İşaretlendi"
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || "Mark as Read Error"})
    }
}

export const changeStatus = async (req: Request, res: Response) => {
    const requst_business_id = Number(req.params.id);
    const status = req.body.status as "pending" | "approved" | "rejected";

    try {
        await service.patch(requst_business_id, "status", status);
        await service.patch(requst_business_id, "is_read", true);

        return res.status(200).json({ 
            success: true,
            message: "Durum Değiştirildi"
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || "Status Change Error"});
    }
}

export const create = async (req: Request, res: Response) => {
    const sender   = req.body.sender;
    const business = req.body.business;
    const package_type  = req.body.package;

    const request_business: Partial<RequestBusiness> = {
        sender, business, package:package_type
    };

    try {
        const result = await service.create(request_business);
        res.status(201).json({ success: true, message: "Talep Başarıyla Oluşturuldu.", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || "Talep Gönderilemedi" });
    }
};