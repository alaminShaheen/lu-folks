import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";
import uuid4 from "uuid4";
import UserEntity from "./user.entity";
import GroupEntity from "./group.entity";
import CommentEntity from "./comment.entity";

@Entity()
class PostEntity {
	@PrimaryColumn({ type: "varchar", default: uuid4() })
	id: string;

	@Column()
	title: string;

	@Column({ type: "json" })
	content: PostContent;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => UserEntity, (user) => user.posts, {
		onDelete: "CASCADE",
	})
	@JoinColumn()
	// will create a userId
	createdBy: UserEntity;

	@OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: true })
	comments: CommentEntity[];

	@ManyToOne(() => GroupEntity, (group) => group.posts, { onDelete: "CASCADE" })
	@JoinColumn()
	group: GroupEntity;

	@ManyToMany(() => UserEntity, (user) => user.postsReactedTo, {
		onDelete: "NO ACTION",
		onUpdate: "NO ACTION",
	})
	@JoinTable({
		name: "postReactions",
		joinColumn: {
			name: "postId",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "userId",
			referencedColumnName: "id",
		},
	})
	userReactions: UserEntity[];
}

export default PostEntity;
