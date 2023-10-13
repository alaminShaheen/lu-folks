import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstname: string;

	@Column()
	email: string;
}

export default UserEntity;
