import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";
import uuid4 from "uuid4";
import PostEntity from "./post.entity";
import UserEntity from "./user.entity";

@Entity()
class GroupEntity {
	@PrimaryColumn({ type: "varchar", default: uuid4() })
	id: string;

	@Column()
	title: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => UserEntity, (user) => user.createdGroups, { onDelete: "CASCADE" })
	createdBy: UserEntity;

	@OneToMany(() => PostEntity, (post) => post.group, { cascade: true })
	posts: PostEntity[];

	@ManyToMany(() => UserEntity, (user) => user.groupMemberships, {
		onDelete: "NO ACTION",
		onUpdate: "NO ACTION",
	})
	@JoinTable({
		name: "group_membership",
		joinColumn: {
			name: "groupId",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "userId",
			referencedColumnName: "id",
		},
	})
	members?: UserEntity[];
}

export default GroupEntity;
