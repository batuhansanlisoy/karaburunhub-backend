import { ExploreFeed } from "../Entity/ExploreFeed";
import { ExploreFeedRepository } from "~/Repository/ExploreFeed";

export class ExploreFeedService {
    private repo = new ExploreFeedRepository();

    async getByTargetList(item_type: string, item_id: number): Promise<ExploreFeed[]> {
        return this.repo.findAllByTarget(item_type, item_id);
    }
}
