import { Field, InputType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NoticeStatus } from '../../enums/notice.enum';

@InputType()
export class NoticeUpdateInput {
	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	@Field(() => String, { nullable: true })
	noticeTitle?: string;

	@Field(() => String, { nullable: true })
	noticeContent?: string;

	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}
