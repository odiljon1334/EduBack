import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { ObjectId } from 'mongoose';
import { availableNotifSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { NotificationType } from '../../enums/notification.enum';

@InputType()
export class NoticeInput {
	@IsNotEmpty()
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@IsNotEmpty()
	@Field(() => String)
	noticeTitle: string;

	@IsNotEmpty()
	@Field(() => String)
	noticeContent: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	event?: boolean;

	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}

@InputType()
export class NoticeSearch {
	@IsOptional()
	@Field(() => [NoticeCategory], { nullable: true })
	categoryList?: NoticeCategory[];

	@IsOptional()
	@Field(() => [NoticeStatus], { nullable: true })
	typeList?: NoticeStatus[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class NoticeInquiry {
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
	@Field(() => NoticeSearch, { nullable: true })
	search?: NoticeSearch;
}
