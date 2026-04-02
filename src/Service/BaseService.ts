import path from 'path';
import { FileService } from './File';

export abstract class BaseService<T> {
    protected repo: any;

    constructor(repo: any) {
        this.repo = repo; // Burayı düzelttik, repo artık kullanılabilir
    }

    /**
     * Ortak Dosya Yükleme ve Veritabanı Güncelleme Mantığı
     * @param id Güncellenecek kaydın ID'si
     * @param files Express-FileUpload veya Multer'dan gelen dosyalar
     * @param folder "activity", "place", "organization" gibi klasör adı
     */
    async handleFileUpload(id: number, files: any, folder: string): Promise<any> {
        let cover: { url: string, filename: string, path: string } | undefined;
        let gallery: string[] | undefined;

        // 1. Kapak Fotoğrafı İşleme
        if (files?.cover?.[0]) {
            const file = files.cover[0];
            const savedPath = await FileService.saveAndCompress(
                file.buffer, 
                folder, 
                id.toString()
            );

            cover = {
                url: `/${savedPath}`,
                filename: path.basename(savedPath),
                path: path.dirname(savedPath)
            };
        }

        // 2. Galeri Fotoğrafları İşleme
        if (files?.['gallery[]']?.length > 0) {
            const galleryPromises = files['gallery[]'].map((f: any) =>
                FileService.saveAndCompress(f.buffer, folder, id.toString())
            );

            const savedGalleryPaths = await Promise.all(galleryPromises);
            gallery = savedGalleryPaths.map(p => `/${p}`);
        }

        // 3. Payload Oluşturma
        const payload: any = {
            ...(cover && { cover }),
            ...(gallery && { gallery })
        };

        // 4. Veritabanını Güncelle (Repo üzerinden)
        if (Object.keys(payload).length > 0) {
            await this.repo.update(id, payload);
        }

        return payload;
    }
}