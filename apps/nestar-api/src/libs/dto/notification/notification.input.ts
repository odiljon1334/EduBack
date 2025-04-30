import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { NotificationGroup, NotificationType } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';
import { availableNotifSorts } from '../../config';
import { Direction } from '../../enums/common.enum';

@InputType()
export class NotificationInput {
	@IsNotEmpty()
	@Field(() => String)
	notificationType: NotificationType;

	@IsNotEmpty()
	@Field(() => String)
	notificationGroup: NotificationGroup;

	@IsNotEmpty()
	@Field(() => String)
	@Length(1, 30)
	notificationTitle: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@Length(1, 50)
	notificationDesc?: string;

	authorId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	receiverId: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	courseId?: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	articleId?: ObjectId;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}

@InputType()
export class NotifInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableNotifSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => [Search], { nullable: true })
	search?: Search[];
}

@InputType()
export class Search {
	@IsOptional()
	@Field(() => [NotificationType], { nullable: true })
	notificationType?: NotificationType[];

	@IsOptional()
	@Field(() => [NotificationGroup], { nullable: true })
	notificationGroup?: NotificationGroup[];
}
