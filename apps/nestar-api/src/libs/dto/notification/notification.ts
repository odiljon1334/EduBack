import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { Member, TotalCounter } from '../member/member';
import { Courses } from '../course/course';
import { BoardArticle } from '../board-article/board-article';

@ObjectType()
export class Notification {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NotificationType, { nullable: true })
	notificationType?: NotificationType;

	@Field(() => NotificationStatus)
	notificationStatus: NotificationStatus;

	@Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;

	@Field()
	notificationTitle: string;

	@Field({ nullable: true })
	notificationDesc?: string;

	@Field(() => String)
	authorId: ObjectId;

	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String, { nullable: true })
	propertyId?: ObjectId;

	@Field(() => String, { nullable: true })
	articleId?: ObjectId;

	@Field(() => Member, { nullable: true })
	authorData?: Member;

	@Field(() => Courses, { nullable: true })
	courseData?: Courses;

	@Field(() => Member, { nullable: true })
	receiverData?: Member;

	@Field(() => BoardArticle, { nullable: true })
	articleData?: BoardArticle;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}

@ObjectType()
export class NotifList {
	@Field(() => [Notification])
	list: [];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
