import { GetMyApplicationInfo, GetUserInfo } from "./dto";
import type { UserRepository } from "./user.repository";

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getByEmail(email: string): Promise<GetUserInfo> {
    const user = await this.repository.findBy({ email });
    return GetUserInfo.fromEntity(user);
  }

  async getById(id: string): Promise<GetUserInfo> {
    const user = await this.repository.findBy({ id });
    return GetUserInfo.fromEntity(user);
  }

  async getMyApplications(userId: string): Promise<GetMyApplicationInfo[]> {
    const pairs = await this.repository.findMyApplications(userId);
    return pairs.map(({ application, mclass }) =>
      GetMyApplicationInfo.fromEntities(application, mclass)
    );
  }
}
