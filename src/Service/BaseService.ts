import path from 'path';
import { FileService } from './File';
import { R2Service } from './R2';

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

    /**
     * Ortak Video Yükleme ve R2 Veritabanı Güncelleme Mantığı
     * @param id Güncellenecek kaydın ID'si
     * @param videoFile Multer'dan gelen req.file nesnesi
     */
    async handleVideoUpload(id: number, videoFile: any): Promise<any> {
        if (!videoFile) throw new Error("Video dosyası yüklenemedi.");

        const currentItem = await this.repo.getById(id);
        if (!currentItem) throw new Error("Kayıt bulunamadı");

        const videoPath = videoFile.key; 

        let currentVideos: string[] = [];
        if (currentItem.video_urls) {
            currentVideos = typeof currentItem.video_urls === 'string' 
                ? JSON.parse(currentItem.video_urls) 
                : currentItem.video_urls;
        }

        currentVideos.push(videoPath);

        await this.repo.update(id, {
            video_urls: JSON.stringify(currentVideos)
        });

        return currentVideos;
    }

    /**
     * Ortak R2 Bulutundan ve DB'den Video Silme Mantığı
     * @param id Kaydın ID'si
     * @param videoPath Silinmek istenen ham R2 key yolu (örn: beach/videos/1/xyz.mp4)
     */
    async deleteVideo(id: number, videoPath: string): Promise<void> {
        const item = await this.repo.getById(id);
        if (!item) throw new Error("Kayıt bulunamadı");

        let currentVideos: string[] = [];
        if (item.video_urls) {
            currentVideos = typeof item.video_urls === 'string' 
                ? JSON.parse(item.video_urls) 
                : item.video_urls;
        }

        if (!currentVideos.includes(videoPath)) {
            throw new Error("Bu video zaten bu öğeye ait değil.");
        }

        await R2Service.deleteVideoFromR2(videoPath);

        const updatedVideos = currentVideos.filter(path => path !== videoPath);

        await this.repo.update(id, {
            video_urls: JSON.stringify(updatedVideos)
        });
    }
}