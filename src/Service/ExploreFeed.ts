import { ExploreFeed } from "../Entity/ExploreFeed";
import { ExploreFeedRepository } from "~/Repository/ExploreFeed";

export class ExploreFeedService {
    private repo = new ExploreFeedRepository();

    async list(
        shuffle?: boolean,
        active?: boolean,
        itemType?: string,
        itemId?: number
    ): Promise<ExploreFeed[]> {
        return this.repo.getAll(
            shuffle, active, itemType, itemId
        );
    }

    async getByTargetList(item_type: string, item_id: number): Promise<ExploreFeed[]> {
        return this.repo.findAllByTarget(item_type, item_id);
    }
}
