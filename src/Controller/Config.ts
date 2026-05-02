import { Request, Response } from "express";

export const getLaunchPopup = async (req: Request, res: Response) => {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        const popupData = {
            imageUrl: `${baseUrl}/images/afis.png`,
            targetUrl: `${baseUrl}/request/business/form`,
            isActive: true,
            version: "1.0.0"
        };

        return res.status(200).json(popupData);
    } catch (error) {
        return res.status(500).json({ message: "Afiş bilgileri alınamadı" });
    }
};