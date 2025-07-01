import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { MemberService } from '../member/member.service';
import { CourseService } from '../course/course.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { lookupMember } from '../../libs/config';
import { T } from '../../libs/types/common';
import { NotificationService } from '../notification/notification.service';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';
import { Courses } from '../../libs/dto/course/course';
import { BoardArticle } from '../../libs/dto/board-article/board-article';
import { Member } from '../../libs/dto/member/member';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel('Comment') private readonly commentModel: Model<Comment>,
		private readonly memberService: MemberService,
		private readonly courseService: CourseService,
		private readonly boardArticleService: BoardArticleService,
		private notificationService: NotificationService,
	) {}

	public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
		input.memberId = memberId;

		let result = null;
		try {
			result = await this.commentModel.create(input);
		} catch (err) {
			console.log('Error, Service.Model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}

		switch (input.commentGroup) {
			case CommentGroup.COURSE:
				const targetCourse: Courses = await this.courseService.getCourse(memberId, input.commentRefId);
				const targetId = input.memberId;
				const members: Member = await this.memberService.getMember(memberId, targetId);
				console.log('members:', members);
				if (!targetCourse) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
				await this.courseService.courseStatsEditor({
					_id: input.commentRefId,
					targetKey: 'propertyComments',
					modifier: 1,
				});
				await this.notificationService.createNotification({
					authorId: input.memberId,
					notificationGroup: NotificationGroup.COURSE,
					notificationType: NotificationType.COMMENT,
					notificationTitle: 'New comment on your course!',
					notificationDesc: ` commented on your course, ${targetCourse.courseTitle}`,
					courseId: input.commentRefId,
					receiverId: targetCourse.memberId,
				});
				break;
			case CommentGroup.ARTICLE:
				const targetArticle: BoardArticle = await this.boardArticleService.getBoardArticle(
					memberId,
					input.commentRefId,
				);
				await this.boardArticleService.boardArticleStatsEditor({
					_id: input.commentRefId,
					targetKey: 'articleComments',
					modifier: 1,
				});
				await this.notificationService.createNotification({
					authorId: input.memberId,
					notificationGroup: NotificationGroup.ARTICLE,
					notificationType: NotificationType.COMMENT,
					notificationTitle: 'New comment on your article!',
					notificationDesc: ` commented on your article, ${targetArticle.articleTitle}`,
					articleId: input.commentRefId,
					receiverId: targetArticle.memberId,
				});
				break;
			case CommentGroup.MEMBER:
				const targetMember: Member = await this.memberService.getMember(memberId, input.commentRefId);
				if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
				await this.memberService.memberStatsEditor({
					_id: input.commentRefId,
					targetKey: 'memberComments',
					modifier: 1,
				});
				await this.notificationService.createNotification({
					authorId: input.memberId,
					notificationGroup: NotificationGroup.MEMBER,
					notificationType: NotificationType.COMMENT,
					notificationTitle: 'New comment on your profile!',
					notificationDesc: ` commented on your profile, `,
					receiverId: targetMember._id,
				});
			default:
				break;
		}
		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
		return result;
	}

	public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
		const { _id } = input;
		const result = await this.commentModel
			.findOneAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					commentStatus: CommentStatus.ACTIVE,
				},
				input,
				{
					new: true,
				},
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
		const { commentRefId } = input.search;
		const match: T = { commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result: Comments[] = await this.commentModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// meliked
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
		const result = await this.commentModel.findByIdAndDelete(input).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}
