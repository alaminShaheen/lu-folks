import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import SessionEntity from "@/database/entities/session.entity";

@Entity()
class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column()
	password: string;

	// on deletion of session, set session in this entity as null
	@OneToOne(() => SessionEntity, (session) => session.user, {
		nullable: true,
		onDelete: "SET NULL",
	})
	// creates a sessionId in this table referencing to session table
	@JoinColumn()
	session: SessionEntity;
}

export default UserEntity;
