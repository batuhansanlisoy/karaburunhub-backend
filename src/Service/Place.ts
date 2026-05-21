import db from "../db/knex";
import { Place } from "../Entity/Place";
import { BaseService } from "./BaseService";
import { FileService } from "./File";
import { PlaceRepository } from "../Repository/Place";
import { LocationDistanceOrchestrator } from "./Distance";
import { ExploreFeed } from "~/Entity/ExploreFeed";
import { ExploreFeedRepository } from "~/Repository/ExploreFeed";
import { R2Service } from "./R2";

export class PlaceService extends BaseService<Place> {
    constructor() {
        super(new PlaceRepository())
    };

    private distanceService = new LocationDistanceOrchestrator();
    private exploreRepository = new ExploreFeedRepository();

    async single(id: number): Promise<Place> {
        return this.repo.getById(id);
    }

    async list(village_id?: number, ids?: number[]): Promise<Place[]> {

        return this.repo.getAll(village_id, ids);
    }

    async create(place: Partial<Place>): Promise<number[]> {

        const placeIds = await this.repo.create(place);
        const placeId = placeIds[0];

        if (place.latitude != null || place.longitude != null) {

            this.distanceService.onPlaceCreated(placeId, place.latitude!, place.longitude!);
        }

        return placeIds;
    }

    async update(id: number, payload: Partial<Place>): Promise<void> {
        await this.repo.update(id, payload);
    }

    /**
     * Mekâna yeni bir video yükler, R2 buluta gönderir ve isteğe bağlı olarak Keşfet'te paylaşır.
     * * @param placeId - Videonun ekleneceği mekânın benzersiz ID'si
     * @param file - Yüklenecek olan video dosyası nesnesi
     * @param shareToExplore - Keşfet (Explore Feed) tablosuna kaydedilip kaydedilmeyeceği (Opsiyonel)
     * @param description - Keşfet için özel açıklama metni, girilmezse mekân adı basılır (Opsiyonel)
     * @returns -Geriye değer döndürmez
     * @throws Video URL'si oluşturulamazsa veya yükleme başarısız olursa hata fırlatır
     */
    async uploadPlaceVideo(
        placeId: number,
        file: Express.Multer.File,
        shareToExplore?: boolean, // keşfet tablosuna kaydedilsin mi
        description?: string
    ): Promise<void> {
        const videos = await this.handleVideoUpload(placeId, file);

        const lastVideo = videos.at(-1);

        if (!lastVideo) {
            throw new Error("Video url not found");
        }

        if (shareToExplore) {
            this.addExplore(placeId, lastVideo, description);
        }
    }

    /**
     * R2 bulutta kayıtlı bir place nesnesine ait video siler, Eğer bu video keşfet tablosunda var oradanda siler
     * @param placeId - Silinecek videonun yani place' e ait benzersiz id 
     * @param videoPath - Her bir place nesnesi içerisinde videolar video_urls içinde array olarak tutulur
     * bu yüzden silinecek video pathini seçmek zorundayız
     * @returns -Geriye değer döndürmez
     */
    async deletePlaceVideo(
        placeId: number,
        videoPath: string
    ): Promise<void> {
        try {
            await this.deleteVideo(placeId, videoPath);
    
            const exploreEntity = await this.exploreRepository.findByVideoUrl(videoPath);
    
            if (exploreEntity) {
                await this.exploreRepository.del(exploreEntity.id);
            }
        } catch (error) {
            console.error("An error occured while removing place video:", error);
        }
    }

    /**
     * Burası tamamen place silme durumunda çalışır
     * 1- Sunucunun kendi içerisindeki bulunan cover gallery fotoğraflarını temizler
     * 2- R2 sunucusunda bulunan videoları varsa bunları temizler
     * 3- Keşfet tablosundaki item_type & item_id ile eşleşen bütün kayıtları siler
     * 4- Kendi tablosundaki kaydını siler 
     * Böylece sistemden tamamen aforoz edilir, Hiçbir kaydı kalmaz
     * @param id Silinecek entitynin benzersiz id' si
     * @returns - Geriye herhangi birşey döndürmez
     */
    async del(id: number): Promise<void> {
        const place = await this.repo.getById(id);

        if (!place) {
            throw new Error("Place not found");
        }

        // r2 deki dosya yolu
        const r2Folder = `place/videos/${id}`;

        await db.transaction(async (trx) => {
            await this.repo.del(id, trx);
            await this.exploreRepository.delByTarget("place", place.id, trx);
        });

        await R2Service.deleteFolder(r2Folder);

        try {
            FileService.deleteFolder(`upload/place/${id}`);
        } catch (error) {
            console.error("Locale file deletion error", error);
        }
    }

    /**
     * Video upload içerisinde çalışıyor
     * Keşfete gönder seçeneği varsa keşfet tablosuna ekleme yapar
     * @param placeId - Keşfet tablosuna eklenecek benzersiz id
     * @param videoUrl - Kaydedilecek video url
     * @param description - Keşfet videosunun açıklaması
     * @returns -Geriye değer döndürmez
     */
    private async addExplore(
        placeId: number,
        videoUrl: string,
        description?: string
    ): Promise<void> {
        const place = await this.repo.getById(placeId);

        if (!place) {
            throw new Error("Place not found");
        }

        const payload: Partial<ExploreFeed> = {
            item_type: "place",
            item_id: place.id,
            title: description ?? place.name,
            video_url: videoUrl,
            score: 0
        }

        await this.exploreRepository.create(payload);
    }
}
