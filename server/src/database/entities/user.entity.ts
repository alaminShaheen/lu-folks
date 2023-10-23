import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";
import SessionEntity from "@/database/entities/session.entity";
import AuthProvider from "@/models/enums/AuthProvider";
import { createId } from "@paralleldrive/cuid2";

@Entity()
class UserEntity {
	@PrimaryColumn({ type: "varchar", default: createId() })
	id: string;

	@Column({ unique: true })
	username: string;

	@Index({ unique: true })
	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	password: string;

	// on deletion of session, set session in this entity as null
	@OneToOne(() => SessionEntity, (session) => session.user, {
		nullable: true,
		onDelete: "SET NULL",
	})
	// creates a sessionId in this table referencing to session table
	@JoinColumn()
	session: SessionEntity;

	@Column({ type: "enum", enum: AuthProvider, default: AuthProvider.VANILLA })
	authProvider: AuthProvider;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default UserEntity;
