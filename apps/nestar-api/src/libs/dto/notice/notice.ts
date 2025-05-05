import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { Member } from '../member/member';

@ObjectType()
export class Notice {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field(() => NoticeStatus)
	noticeStatus: NoticeStatus;

	@Field(() => String)
	noticeTitle: string;

	@Field(() => String)
	noticeContent: string;

	@Field(() => Boolean, { nullable: true })
	event?: boolean;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date, { nullable: true })
	updatedAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;
}

@ObjectType()
export class TotalNoticeCounter {
	@Field(() => Int, { nullable: true })
	total: number;
}

@ObjectType()
export class NoticeList {
	@Field(() => [Notice])
	list: Notice[];

	@Field(() => [TotalNoticeCounter], { nullable: true })
	metaCounter: TotalNoticeCounter[];
}
