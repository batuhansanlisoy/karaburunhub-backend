import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";

const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    }
});

export class R2Service {
    static videoStreamUploader(folderName: string) {
        return multer({
            storage: multerS3({
                s3: r2Client,
                bucket: process.env.R2_BUCKET_NAME!,
                contentType: multerS3.AUTO_CONTENT_TYPE, // Video tipini tarayıcı için otomatik ayarlar (mp4 vb.)
                key: function (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) {
                    
                    const { id } = req.params;
                    const folderId = id || "unknown";

                    const ext = file.originalname.split(".").pop();
                    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;

                    cb(null, `${folderName}/videos/${folderId}/${fileName}`);
                }
            }),
            limits: {
                fileSize: 75 * 1024 * 1024
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith("video/")) {
                    cb(null, true);
                } else {
                    cb(new Error("Sadece video dosyası yüklenebilir!"));
                }
            }
        });
    }

    static async deleteVideoFromR2(key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: key,
            });

            await r2Client.send(command);
            console.log(`[R2 SUCCESS] Video R2 bulutundan başarıyla temizlendi: ${key}`);
        } catch (error: any) {
            console.error("[R2 ERROR] Video R2'den silinirken hata:", error);
            throw new Error(`Video buluttan silinemedi: ${error.message}`);
        }
    }
}