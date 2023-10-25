import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";
import UserEntity from "./user.entity";
import PostEntity from "./post.entity";

@Entity()
class PostReactionEntity {
	@PrimaryColumn()
	userId: string;

	@PrimaryColumn()
	postId: string;

	@ManyToOne(() => UserEntity, (user) => user.postReactions)
	@JoinColumn({ name: "userId" })
	user: UserEntity;

	@ManyToOne(() => PostEntity, (post) => post.postReactions)
	@JoinColumn({ name: "postId" })
	post: PostEntity;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default PostReactionEntity;
