import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";
import uuid4 from "uuid4";
import UserEntity from "./user.entity";
import CommentEntity from "./comment.entity";
import PostReactionEntity from "./postReaction.entity";

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
	comments: Comment[];

	@OneToMany(() => PostReactionEntity, (postReaction) => postReaction.post, { cascade: true })
	postReactions: PostReactionEntity[];
}

export default PostEntity;
