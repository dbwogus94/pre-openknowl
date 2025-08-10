import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { ApplyMClassCommand } from "../../../src/api/public/mclass/dto/command/apply-mclass-command.dto";
import { MClassCoreRepository } from "../../../src/api/public/mclass/mclass.repository";
import { PublicMClassService } from "../../../src/api/public/mclass/mclass.service";
import {
  ConflictStatusException,
  ResourceNotFoundException,
} from "../../../src/common";
import {
  ApplicationEntity,
  MClassEntity,
  OrmDataSource,
  UserEntity,
} from "../../../src/orm/index";

describe("PublicMClassService integration", () => {
  let service: PublicMClassService;

  beforeAll(async () => {
    if (!OrmDataSource.isInitialized) {
      await OrmDataSource.initialize();
    }
    await OrmDataSource.synchronize(true);
    service = new PublicMClassService(
      new MClassCoreRepository(OrmDataSource.getRepository(MClassEntity))
    );
  });

  afterAll(async () => {
    if (OrmDataSource.isInitialized) await OrmDataSource.destroy();
  });

  beforeEach(async () => {
    await OrmDataSource.manager.clear(ApplicationEntity);
    await OrmDataSource.manager.clear(MClassEntity);
    await OrmDataSource.manager.clear(UserEntity);
  });

  it("신청 성공 - 빈 클래스에 첫 신청", async () => {
    // Given
    const host = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "host@example.com",
        passwordHash: "x",
      })
    );
    const user = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "user1@example.com",
        passwordHash: "x",
      })
    );
    const mclass = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(MClassEntity, {
        title: "Test Class",
        description: null,
        maxParticipants: 10,
        hostId: host.id,
      })
    );

    // When
    const applicationId = await service.apply(
      new ApplyMClassCommand(mclass.id, user.id)
    );

    // Then
    expect(applicationId).toBeDefined();
    const application = await OrmDataSource.manager.findOneBy(
      ApplicationEntity,
      { id: applicationId }
    );
    expect(application?.userId).toBe(user.id);
    expect(application?.mclassId).toBe(mclass.id);
  });

  it("중복 신청은 409 에러", async () => {
    // Given
    const host = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "host2@example.com",
        passwordHash: "x",
      })
    );
    const user = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "user2@example.com",
        passwordHash: "x",
      })
    );
    const mclass = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(MClassEntity, {
        title: "Dup Class",
        description: null,
        maxParticipants: 10,
        hostId: host.id,
      })
    );

    await service.apply(new ApplyMClassCommand(mclass.id, user.id));
    await expect(
      service.apply(new ApplyMClassCommand(mclass.id, user.id))
    ).rejects.toBeInstanceOf(ConflictStatusException);
  });

  it("정원 초과는 409 에러", async () => {
    // Given
    const host = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "host3@example.com",
        passwordHash: "x",
      })
    );
    const user1 = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "u3-1@example.com",
        passwordHash: "x",
      })
    );
    const user2 = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "u3-2@example.com",
        passwordHash: "x",
      })
    );
    const mclass = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(MClassEntity, {
        title: "Full Class",
        description: null,
        maxParticipants: 1,
        hostId: host.id,
      })
    );

    await service.apply(new ApplyMClassCommand(mclass.id, user1.id));
    await expect(
      service.apply(new ApplyMClassCommand(mclass.id, user2.id))
    ).rejects.toBeInstanceOf(ConflictStatusException);
  });

  it("존재하지 않는 클래스는 404 에러", async () => {
    const user = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "user404@example.com",
        passwordHash: "x",
      })
    );
    await expect(
      service.apply(new ApplyMClassCommand("999999", user.id))
    ).rejects.toBeInstanceOf(ResourceNotFoundException);
  });

  it("아직 시작 전인 경우 409 에러", async () => {
    // Given
    const host = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "host-future@example.com",
        passwordHash: "x",
      })
    );
    const user = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "user-future@example.com",
        passwordHash: "x",
      })
    );
    const startAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const mclass = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(MClassEntity, {
        title: "Not Started Class",
        description: null,
        maxParticipants: 10,
        hostId: host.id,
        startAt,
      })
    );

    // When & Then
    await expect(
      service.apply(new ApplyMClassCommand(mclass.id, user.id))
    ).rejects.toBeInstanceOf(ConflictStatusException);
  });

  it("마감(종료)된 경우 409 에러", async () => {
    // Given
    const host = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "host-ended@example.com",
        passwordHash: "x",
      })
    );
    const user = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(UserEntity, {
        email: "user-ended@example.com",
        passwordHash: "x",
      })
    );
    const endAt = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const mclass = await OrmDataSource.manager.save(
      OrmDataSource.manager.create(MClassEntity, {
        title: "Ended Class",
        description: null,
        maxParticipants: 10,
        hostId: host.id,
        endAt,
      })
    );

    // When & Then
    await expect(
      service.apply(new ApplyMClassCommand(mclass.id, user.id))
    ).rejects.toBeInstanceOf(ConflictStatusException);
  });
});
