import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { NoticeService } from './notice.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { NoticeInput, NoticeInquiry } from '../../libs/dto/notice/notice.input';
import { Notice, NoticeList } from '../../libs/dto/notice/notice';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { NoticeUpdateInput } from '../../libs/dto/notice/notice.update';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class NoticeResolver {
	constructor(private readonly noticeService: NoticeService) {}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	public async createNotice(@Args('input') input: NoticeInput, @AuthMember('_id') memberId: ObjectId): Promise<Notice> {
		console.log('Mutation: createNotice', memberId);
		input.memberId = memberId;
		return await this.noticeService.createNotice(input);
	}

	@Query(() => NoticeList)
	public async getNotices(
		@Args('input') input: NoticeInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<NoticeList> {
		console.log('Query: getNotices', memberId);
		return await this.noticeService.getNotices(memberId, input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	public async updateNotice(
		@Args('input') input: NoticeUpdateInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('Mutation: updateNotice');
		input.memberId = memberId;
		return await this.noticeService.updateNotice(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	public async removeNotice(@Args('noticeId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Notice> {
		console.log('Mutation: deleteNotice');
		const noticeId = shapeIntoMongoObjectId(input);
		return await this.noticeService.removeNotice(noticeId);
	}
}
