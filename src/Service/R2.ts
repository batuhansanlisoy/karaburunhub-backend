import { S3Client, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
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

    static async deleteFolder(prefix: string): Promise<void> {
        try {
            // GÜVENLİK DUVARI: Eksik veya hatalı prefix gelirse tüm bucket'ın uçmasını engeller
            if (!prefix || prefix.trim() === "" || prefix.includes("//") || prefix.length < 10) {
                return;
            }

            // 1. Sadece o ID'ye ait klasörün içindeki nesneleri listele
            const listCommand = new ListObjectsV2Command({
                Bucket: process.env.R2_BUCKET_NAME!,
                Prefix: prefix
            });

            const listedObjects = await r2Client.send(listCommand);

            // Klasör zaten boşsa veya R2'de yoksa işlem yapmadan çık
            if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
                return;
            }

            const deleteParams = {
                Bucket: process.env.R2_BUCKET_NAME!,
                Delete: { 
                    Objects: listedObjects.Contents.map(({ Key }) => ({ Key: Key! })),
                    Quiet: true
                }
            };

            await r2Client.send(new DeleteObjectsCommand(deleteParams));
        } catch (error: any) {
            console.error("[R2 ERROR] Klasör silinirken hata oluştu:", error);
            throw new Error(`R2 klasör silme başarısız: ${error.message}`);
        }
    }
}