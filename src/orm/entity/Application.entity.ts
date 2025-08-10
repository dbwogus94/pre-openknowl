import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MClassEntity } from './MClass.entity';
import { UserEntity } from './User.entity';

@Entity({ name: 'applications' })
@Index('uk_app_user_class', ['userId', 'mclassId'], { unique: true })
@Index('idx_app_user', ['userId'])
@Index('idx_app_class', ['mclassId'])
export class ApplicationEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id!: string;

	@CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
	createdAt!: Date;

	@Column({ name: 'userId', type: 'bigint' })
	userId!: string;

	@Column({ name: 'mclassId', type: 'bigint' })
	mclassId!: string;

	@ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', eager: false })
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;

	@ManyToOne(() => MClassEntity, { onDelete: 'RESTRICT', eager: false })
	@JoinColumn({ name: 'mclassId', referencedColumnName: 'id' })
	mclass!: MClassEntity;
}
