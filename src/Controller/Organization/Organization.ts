import { Request, Response } from "express";
import { OrganizationService } from "../../Service/Organization/Organization";
import { Organization } from "../../Entity/Organization/Organization";

const service = new OrganizationService();

export const show = async (req: Request, res: Response) => {
    res.render("organization", {
    title: "İşletmeler",
    activePage: "organization",
    page: "organization"
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        const category_id = req.query.category_id ? Number(req.query.category_id) : undefined;

        const organizations: Organization[] = await service.list(category_id);
        res.json(organizations);
    } catch (err) {
        console.error(err);
        res.status(500).send("Organizasyon listesi alınamadı");
    }
};


// export const create = async (req: Request, res: Response) => {
//     try {

//         const village_id = Number(req.body.village_id);
//         const title = req.body.title;
//         const subtitle = req.body.subtitle;
//         const address = req.body.address;
//         const url = req.body.url;

//         if (!village_id || !title || !address) {
//             return res.status(400).send("Village, Title ve Adress Alanları zorunludur");
//         }

//         const beach: Partial<Beach> = {
//             village_id,
//             content: {
//                 title,
//                 subtitle,
//                 address
//             },
//             url
//         };
//         await service.create(beach);

//         res.status(201).send(`Plaj '${title}' başarıyla eklendi`);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Plaj eklenirken hata oluştu");
//     }
// };
