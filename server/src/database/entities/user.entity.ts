import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";
import uuid4 from "uuid4";
import PostEntity from "./post.entity";
import AuthProvider from "../../models/enums/AuthProvider";
import SessionEntity from "./session.entity";
import CommentEntity from "./comment.entity";
import PostReactionEntity from "./postReaction.entity";

@Entity()
class UserEntity {
	@PrimaryColumn({ type: "varchar", default: uuid4() })
	id: string;

	@Column({ unique: true })
	username: string;

	@Index({ unique: true })
	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	password: string;

	@Column({ type: "enum", enum: AuthProvider, default: AuthProvider.VANILLA })
	authProvider: AuthProvider;

	// on deletion of session, set session in this entity as null
	@OneToOne(() => SessionEntity, (session) => session.user, {
		nullable: true,
		onDelete: "SET NULL",
	})
	// creates a sessionId in this table referencing to session table
	@JoinColumn()
	session: SessionEntity;

	@OneToMany(() => PostEntity, (post) => post.createdBy, { cascade: true })
	// just used for defining relationship. will not create column for this attribute in user side
	posts: PostEntity[];

	@OneToMany(() => PostReactionEntity, (postReaction) => postReaction.user, { cascade: true })
	postReactions: PostReactionEntity[];

	@OneToMany(() => CommentEntity, (comment) => comment.commenter, { cascade: true })
	comments: CommentEntity[];

	@ManyToMany(() => UserEntity)
	friends: UserEntity[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default UserEntity;
