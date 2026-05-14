import path from 'path';
import { FileService } from './File';

export abstract class BaseService<T> {
    protected repo: any;

    constructor(repo: any) {
        this.repo = repo;
    }

    /**
     * Ortak Dosya Yükleme ve Veritabanı Güncelleme Mantığı
     * @param id Güncellenecek kaydın ID'si
     * @param files Express-FileUpload veya Multer'dan gelen dosyalar
     * @param folder "activity", "place", "organization" gibi klasör adı
     */
    async handleFileUpload(id: number, files: any, folder: string): Promise<any> {
        const currentItem = await this.repo.getById(id);
        if (!currentItem) throw new Error("Kayıt bulunamadı");

        let coverPayload: any = undefined;
        let finalGallery: string[] = [];

        if (currentItem.gallery) {
            finalGallery = typeof currentItem.gallery === "string" 
                ? JSON.parse(currentItem.gallery) 
                : currentItem.gallery;
        }

        if (files?.cover?.[0]) {
            if (currentItem.cover) {
                const oldCover = typeof currentItem.cover === 'string'
                    ? JSON.parse(currentItem.cover)
                    : currentItem.cover;

                if (oldCover.url) {
                    FileService.delete(oldCover.url);
                }
            }

            const file = files.cover[0];
            const savedPath = await FileService.saveAndCompress(file.buffer, folder, id.toString());

            coverPayload = {
                url: `/${savedPath}`,
                filename: path.basename(savedPath),
                path: path.dirname(savedPath)
            };
        }

        if (files?.['gallery[]']?.length > 0) {
            const galleryPromises = files['gallery[]'].map((f: any) =>
                FileService.saveAndCompress(f.buffer, folder, id.toString())
            );

            const newGalleryPaths = await Promise.all(galleryPromises);
            const newGalleryUrls = newGalleryPaths.map(p => `/${p}`);

            finalGallery = [...finalGallery, ...newGalleryUrls];
        }

        const payload: any = {};
        if (coverPayload) payload.cover = coverPayload;
        if (files?.['gallery[]']?.length > 0) payload.gallery = finalGallery;

        if (Object.keys(payload).length > 0) {
            await this.repo.update(id, payload);
        }

        return payload;
    }

    async deleteImage(id: number, type: 'cover' | 'gallery', index?: number): Promise<void> {
        const item = await this.repo.getById(id);
        if (!item) throw new Error("Kayıt bulunamadı");

        let fileUrlToDelete = "";

        if (type === "cover" && item.cover) {
            const coverData = typeof item.cover === "string" ? JSON.parse(item.cover) : item.cover;
            fileUrlToDelete = coverData.url;

            await this.repo.update(id, { cover: "" });
        } 
        else if (type === "gallery" && item.gallery) {
            let gallery: string[] = [];
            if (typeof item.gallery === "string") {
                try {
                    gallery = JSON.parse(item.gallery);
                } catch (e) {
                    // Eğer veri zaten garip bir formatta kaldıysa temizle
                    gallery = item.gallery.replace(/[\[\]"]/g, "").split(",");
                }
            } else {
                gallery = item.gallery;
            }

            if (index !== undefined && gallery[index]) {
                fileUrlToDelete = gallery[index];
                gallery.splice(index, 1);

                await this.repo.update(id, { gallery });
            }
        }

        if (fileUrlToDelete) {
            FileService.delete(fileUrlToDelete);
        }
    }
}