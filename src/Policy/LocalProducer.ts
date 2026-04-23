// src/Policy/LocalProducer.ts
import { LocalProducerService } from "../Service/LocalProducer";

export class LocalProducerPolicy {
    // service parametresini tip olarak ekledik
    static async canHighlight(service: LocalProducerService, id: number, newValue: boolean): Promise<void> {
        if (newValue === false) return;

        const producer = await service.single(id);
        if (!producer) throw new Error("Üretici bulunamadı.");
        
        if (!producer.is_active) {
            throw new Error("Pasif bir üreticiyi öne çıkaramazsın moruk!");
        }
    }
}