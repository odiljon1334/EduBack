import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { NoticeCategory } from '../../enums/notice.enum';
import { ObjectId } from 'mongoose';

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

	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}
