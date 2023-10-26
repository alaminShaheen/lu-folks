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
import PostEntity from "./post.entity";
import UserEntity from "./user.entity";

@Entity()
class CommentEntity {
	@PrimaryColumn({ type: "varchar", default: uuid4() })
	id: string;

	@Column()
	comment: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => CommentEntity, (comment) => comment.replyTo, { cascade: true })
	replies: Comment[];

	@ManyToOne(() => CommentEntity, (comment) => comment.replies, { onDelete: "CASCADE" })
	@JoinColumn()
	replyTo: CommentEntity;

	@ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: "CASCADE" })
	@JoinColumn()
	commenter: UserEntity;

	@ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: "CASCADE" })
	@JoinColumn()
	post: PostEntity;

	@ManyToMany(() => UserEntity, (user) => user.commentsReactedTo, {
		onDelete: "NO ACTION",
		onUpdate: "NO ACTION",
	})
	@JoinTable({
		name: "commentReactions",
		joinColumn: {
			name: "commentId",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "userId",
			referencedColumnName: "id",
		},
	})
	userReactions: UserEntity[];
}

export default CommentEntity;
