import { Request, Response } from "express";
import { LocalProducerService } from "../Service/LocalProducer";
import { LocalProducer } from "../Entity/LocalProducer";
import { LocalProducerConverter } from "../Converter/LocalProducer";

const service = new LocalProducerService();

export const show = async (req: Request, res: Response) => {
    res.render("local_producer/index", {
    title: "Yerel Üreticiler",
    activePage: "local_producer",
    page: "local_producer"
    });
};

export const list = async (req: Request, res: Response) => {
    const village_id = req.query.village_id ? Number(req.query.village_id) : undefined;
    const highlight = req.query.highlight !== undefined ? req.query.highlight === 'true' : undefined;
    const is_active = req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined

    try {
        const local_producers: LocalProducer[] = await service.list(
            village_id, highlight, is_active
        );

        const response = LocalProducerConverter.toListResponse(local_producers);

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send("Yerel Üretici Listesi Alınırken Bir Hata Meydana Geldi!");
    }
};

export const create = async (req: Request, res: Response) => {
    const village_id = Number(req.body.village_id);
    const name       = req.body.name;
    const title      = req.body.title;
    const email      = req.body.email ?? "";
    const phone      = req.body.phone;
    const products   = req.body.products ?? [];
    const address    = req.body.address;
    
    if (!village_id || !name || !phone || !address) {
        return res.status(400).send("Eksik Alanlar Var");
    }

    const payload: Partial<LocalProducer> = {
        village_id, 
        name, 
        title, 
        email, 
        phone, 
        address,
        extra: { products: products } 
    };

    try {
        const result = await service.create(payload);
        res.status(201).json({ success: true, message: "Local Producer Created", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || "Local Producer could not be created" });
    }
};

export const update = async (req: Request, res: Response) => {
    const id         = Number(req.params.id);
    const name       = req.body.name;
    const title      = req.body.title;
    const email      = req.body.email ?? "";
    const phone      = req.body.phone;
    const address    = req.body.address;
    const village_id = req.body.village_id;

    const payload: Partial<LocalProducer> = { 
        name, title, village_id, email, phone, address
    };

    try {
        const result = await service.update(id, payload);
        return res.json({ result });
    } catch(err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err});
    }
}

export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const result = await service.upload(id, req.files);

        return res.json({ 
            success: true, 
            message: "Fotoğraflar başarıyla yüklendi", 
            data: result 
        });

    } catch (err: any) {
        console.error("Upload Error:", err);
        return res.status(500).json({ 
            message: "Fotoğraflar işlenirken hata oluştu", 
            error: err.message 
        });
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

export const highlight = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const value = req.body.value;

    try {
        const result = await service.patch(id, "highlight", value);

        if (result === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Yerel Üretici Bulunamadı." 
            });
        }

        const local_producer = await service.single(id);

        return res.status(200).json({
            success: true, 
            message: "Öne çıkarma durumu güncellendi.",
            data: local_producer
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || "Highlight error"})
    }
}

export const activation = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const value = req.body.value;

    try {
        const result = await service.patch(id, "is_active", value);

        if (result === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Yerel Üretici Bulunamadı." 
            });
        }

        const local_producer = await service.single(id);

        return res.status(200).json({ 
            success: true, 
            message: "Aktiflik Durumu güncellendi.",
            data: local_producer
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || "Activation error"})
    }
}
