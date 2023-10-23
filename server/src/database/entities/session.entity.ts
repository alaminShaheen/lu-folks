import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import UserEntity from "@/database/entities/user.entity";

@Entity()
class SessionEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	refreshToken: string;

	// on deletion of user, cascade delete this entity
	@OneToOne(() => UserEntity, (user) => user.session, { onDelete: "CASCADE", cascade: true })
	user: UserEntity;
}

export default SessionEntity;
