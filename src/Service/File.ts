// src/services/UploadService.ts
import multer from "multer";
import path from "path";
import fs from "fs";

export class FileService {
    static storage(folder: string) {
        const uploadDir = path.join(__dirname, "../../upload", folder);

        // Klasör yoksa oluştur
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        return multer.diskStorage({
            destination: (req, file, cb) => cb(null, uploadDir),
            filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
        });
    }

    static uploader(folder: string) {
        return multer({ storage: FileService.storage(folder) });
    }
}
