import {
	Column,
	CreateDateColumn,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";
import uuid4 from "uuid4";
import PostEntity from "./post.entity";
import UserEntity from "./user.entity";

class CommentEntity {
	@PrimaryColumn({ type: "varchar", default: uuid4() })
	id: string;

	@Column()
	comment: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: "CASCADE" })
	@JoinColumn()
	post: PostEntity;

	@ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: "CASCADE" })
	@JoinColumn()
	commenter: UserEntity;

	@ManyToOne(() => CommentEntity, (comment) => comment.replies, { onDelete: "CASCADE" })
	@JoinColumn()
	replyTo: CommentEntity;

	@OneToMany(() => CommentEntity, (comment) => comment.replyTo, { cascade: true })
	replies: Comment[];
}

export default CommentEntity;
