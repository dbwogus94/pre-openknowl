import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';

@Entity({ name: 'mclasses' })
export class MClassEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id!: string;

	@CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
	updatedAt!: Date;

	@Column({ type: 'varchar', length: 200 })
	title!: string;

	@Column({ type: 'text', nullable: true })
	description?: string | null;

	@Column({ name: 'maxParticipants', type: 'int', unsigned: true })
	maxParticipants!: number;

	@Column({ name: 'appliedCount', type: 'int', unsigned: true, default: 0 })
	appliedCount!: number;

	@Column({ name: 'version', type: 'int', unsigned: true, default: 0 })
	version!: number;

	@Column({ name: 'startAt', type: 'datetime', precision: 6, nullable: true })
	startAt?: Date | null;

	@Column({ name: 'endAt', type: 'datetime', precision: 6, nullable: true })
	endAt?: Date | null;

	@Column({ name: 'hostId', type: 'bigint' })
	hostId!: string;

	@ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', eager: false })
	@JoinColumn({ name: 'hostId', referencedColumnName: 'id' })
	host!: UserEntity;

	isActive(): boolean {
		return !!this.startAt && !!this.endAt && this.startAt <= new Date() && this.endAt >= new Date();
	}

	isFull(): boolean {
		return this.appliedCount >= this.maxParticipants;
	}

	isEnded(): boolean {
		return !!this.endAt && this.endAt <= new Date();
	}
}
