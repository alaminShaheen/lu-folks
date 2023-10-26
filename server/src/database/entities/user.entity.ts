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
import GroupEntity from "./group.entity";
import AuthProvider from "../../models/enums/AuthProvider";
import SessionEntity from "./session.entity";
import CommentEntity from "./comment.entity";

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

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column()
	imageUrl?: string;

	// on deletion of session, set session in this entity as null
	@OneToOne(() => SessionEntity, (session) => session.user, {
		nullable: true,
		onDelete: "SET NULL",
	})
	// creates a sessionId in this table referencing to session table
	@JoinColumn()
	session: SessionEntity;

	@OneToMany(() => GroupEntity, (group) => group.createdBy, { cascade: true })
	createdGroups: GroupEntity[];

	@OneToMany(() => PostEntity, (post) => post.createdBy, { cascade: true })
	// just used for defining relationship. will not create column for this attribute in user side
	posts: PostEntity[];

	@OneToMany(() => CommentEntity, (comment) => comment.commenter, { cascade: true })
	comments: CommentEntity[];

	@ManyToMany(() => GroupEntity, (group) => group.members, {
		onDelete: "NO ACTION",
		onUpdate: "NO ACTION",
	})
	groupMemberships?: GroupEntity[];

	@ManyToMany(() => PostEntity, (post) => post.userReactions, {
		onDelete: "NO ACTION",
		onUpdate: "NO ACTION",
	})
	postsReactedTo?: PostEntity[];

	@ManyToMany(() => CommentEntity, (comment) => comment.userReactions, {
		onDelete: "NO ACTION",
		onUpdate: "NO ACTION",
	})
	commentsReactedTo?: CommentEntity[];
}

export default UserEntity;
