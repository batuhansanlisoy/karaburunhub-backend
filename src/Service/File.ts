import multer from "multer";
import path from "path";
import fs from "fs";

export class FileService {

    static storage(folder: string, subFolderResolver?: (req: any) => string) {

        return multer.diskStorage({
            destination: (req, file, cb) => {

                const subFolder = subFolderResolver ? subFolderResolver(req) : "";
                const uploadDir = path.join(
                    process.cwd(),
                    "upload",
                    folder,
                    subFolder
                );

                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                cb(null, uploadDir);
            },

            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                cb(null, Date.now() + ext);
            },
        });
    }

    static uploader(
        folder: string,
        subFolderResolver?: (req: any) => string
    ) {
        return multer({
            storage: FileService.storage(folder, subFolderResolver)
        });
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
