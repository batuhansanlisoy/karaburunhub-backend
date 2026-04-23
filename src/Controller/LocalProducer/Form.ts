import { Request, Response } from "express";
import { VillageService } from "~/Service/Village";
import { LocalProducerService } from "~/Service/LocalProducer";
import { LOCAL_PRODUCTS } from "../../shared/constants/local_products";

const village_service = new VillageService();
const local_producer_service = new LocalProducerService();

export const createForm = async (req: Request, res: Response) => {
    const villages = await village_service.list();

    res.render("local_producer/form/create", {
        villages,
        products: LOCAL_PRODUCTS,
        layout: false
    });
};

export const editForm = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const local_producer = await local_producer_service.single(id);
    const villages = await village_service.list();

    res.render("local_producer/form/edit", {
        localProducerId: id,
        layout: false,
        name: local_producer.name,
        email: local_producer.email,
        phone: local_producer.phone,
        title: local_producer.title,
        address: local_producer.address,
        village_id: local_producer.village_id,
        villages: villages
    });
};

export const uploadForm = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.render("local_producer/form/upload", {
        localProducer: id,
        layout: false
    });
};
