import type { Repository } from "typeorm";
import { ResourceNotFoundException } from "@/common";
import type { ApplicationEntity, MClassEntity, UserEntity } from "@/orm";

export type FindWhereOptions = Partial<Pick<UserEntity, "email" | "id">>;
export type CreateUserParams = Pick<UserEntity, "email" | "passwordHash">;

export type UserRepository = {
  exists(options: FindWhereOptions): Promise<boolean>;
  findBy(options: FindWhereOptions): Promise<UserEntity>;
  create(params: CreateUserParams): Promise<UserEntity>;
  findMyApplications(
    userId: string
  ): Promise<Array<{ application: ApplicationEntity; mclass: MClassEntity }>>;
};

export class UserCoreRepository implements UserRepository {
  constructor(private readonly ormUserRepo: Repository<UserEntity>) {}

  async exists(options: FindWhereOptions): Promise<boolean> {
    const user = await this.ormUserRepo.findOneBy(options);
    return user !== null;
  }

  async findBy(options: FindWhereOptions): Promise<UserEntity> {
    const user = await this.ormUserRepo.findOneBy(options);
    if (!user) throw new ResourceNotFoundException();
    return user;
  }

  async create(params: CreateUserParams): Promise<UserEntity> {
    const user = this.ormUserRepo.create(params);
    return await this.ormUserRepo.save(user);
  }

  async findMyApplications(
    userId: string
  ): Promise<Array<{ application: ApplicationEntity; mclass: MClassEntity }>> {
    const appRepo = this.ormUserRepo.manager.getRepository<ApplicationEntity>(
      "applications" as any
    );
    const mclassRepo = this.ormUserRepo.manager.getRepository<MClassEntity>(
      "mclasses" as any
    );

    const applications = await appRepo.find({
      where: { userId } as any,
      order: { createdAt: "DESC" } as any,
    });
    if (applications.length === 0) return [];
    const mclassIds = applications.map((a) => a.mclassId);
    const mclasses = await mclassRepo.findBy({ id: mclassIds as any } as any);
    const mclassMap = new Map(mclasses.map((m) => [m.id, m]));
    return applications
      .map((a) => ({ application: a, mclass: mclassMap.get(a.mclassId)! }))
      .filter((pair) => !!pair.mclass);
  }
}
