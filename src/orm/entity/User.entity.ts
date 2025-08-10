import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
@Unique('uk_users_email', ['email'])
export class UserEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id!: string;

	@CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
	updatedAt!: Date;

	@Column({ type: 'varchar', length: 255 })
	email!: string;

	@Column({ name: 'passwordHash', type: 'varchar', length: 100 })
	passwordHash!: string;

	@Column({ name: 'isAdmin', type: 'tinyint', width: 1, default: 0 })
	isAdmin!: boolean;
}
