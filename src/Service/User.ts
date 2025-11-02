import { UserRepository } from "../Repository/User";
import { User } from "../Entity/User";

export class UserService {
    private repo = new UserRepository();

    async listUsers(): Promise<User[]> {
        return this.repo.getAll();
    }

    async addUser(user: User): Promise<void> {
        await this.repo.create(user);
    }
}
