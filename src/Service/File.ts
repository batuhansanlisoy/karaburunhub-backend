import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";

export class FileService {

    // static storage(folder: string, subFolderResolver?: (req: any) => string) {

    //     return multer.diskStorage({
    //         destination: (req, file, cb) => {

    //             const subFolder = subFolderResolver ? subFolderResolver(req) : "";
    //             const uploadDir = path.join(
    //                 process.cwd(),
    //                 "upload",
    //                 folder,
    //                 subFolder
    //             );

    //             if (!fs.existsSync(uploadDir)) {
    //                 fs.mkdirSync(uploadDir, { recursive: true });
    //             }

    //             cb(null, uploadDir);
    //         },

    //         filename: (req, file, cb) => {
    //             const ext = path.extname(file.originalname);
    //             cb(null, Date.now() + ext);
    //         },
    //     });
    // }

    static uploader() {
        return multer({
            storage: multer.memoryStorage()
        });
    }

    static async saveAndCompress(
        buffer: Buffer,
        folder: string,
        subFolder: string = ""
    ): Promise<string> {

        const uploadDir = path.join(process.cwd(), "upload", folder, subFolder);

        // yoksa dosya oluşturuyor
        if (!fs.existsSync(uploadDir)) {
            await fsPromises.mkdir(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
        const filePath = path.join(uploadDir, fileName);

        // withoutEnlargement fotograf 1200 den küçükse hiç boyutuyla oynama demek
        await sharp(buffer)
            .resize(1200, null, { withoutEnlargement: true })
            .webp({ quality: 75 })
            .toFile(filePath);
        
        return path.join("upload", folder, subFolder, fileName).replace(/\\/g, "/");
    }

    static delete(url: string) {
        const filePath = path.join(process.cwd(), url);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    }

    static deleteFolder(relativePath: string) {
        const dirPath = path.join(process.cwd(), relativePath);

        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
        }
    }
}
