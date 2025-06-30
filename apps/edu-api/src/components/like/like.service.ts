import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { DeleteNotification, OrdinaryInquiry } from '../../libs/dto/course/course.input';
import { CoursesList } from '../../libs/dto/course/course';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';
import { NotificationService } from '../notification/notification.service';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class LikeService {
	constructor(
		@InjectModel('Like') private readonly likeModel: Model<Like>,
		private notificationService: NotificationService,
	) {}

	public async toggleLike(input: LikeInput): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
			exist = await this.likeModel.findOne(search).exec();
		let modifier = 1;
		const match: DeleteNotification = { authorId: input.memberId };

		if (input?.likeGroup === LikeGroup.COURSE) {
			match.courseId = input.likeRefId;
		} else if (input?.likeGroup === LikeGroup.ARTICLE) {
			match.articleId = input.likeRefId;
		} else if (input?.likeGroup === LikeGroup.MEMBER) {
			match.receiverId = input.likeRefId;
		}

		if (exist) {
			await this.notificationService.deleteNotification(match);
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				switch (input.likeGroup) {
					case 'COURSE':
						await this.notificationService.createNotification({
							authorId: input.memberId,
							notificationGroup: NotificationGroup.COURSE,
							notificationType: NotificationType.LIKE,
							notificationTitle: `New like on your course !`,
							notificationDesc: ` liked your course, ${input?.title}`,
							courseId: input.likeRefId,
							receiverId: input?.receiverId,
						});
						break;
					case 'MEMBER':
						await this.notificationService.createNotification({
							authorId: input.memberId,
							notificationGroup: NotificationGroup.MEMBER,
							notificationType: NotificationType.LIKE,
							notificationTitle: 'Someone liked your profile!',
							notificationDesc: ` liked your profile.`,
							receiverId: input?.likeRefId,
						});
						break;
					case 'ARTICLE':
						await this.notificationService.createNotification({
							authorId: input.memberId,
							notificationGroup: NotificationGroup.ARTICLE,
							notificationType: NotificationType.LIKE,
							notificationTitle: 'New like on your article!',
							notificationDesc: ` liked your article, ${input?.title}`,
							articleId: input.likeRefId,
							receiverId: input?.receiverId,
						});
						break;
					default:
						break;
				}
				await this.likeModel.create(input);
			} catch (err) {
				console.log('Error, Service.model:', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}
		console.log(`- LIKE modifier ${modifier} -`);
		return modifier;
	}

	public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
		const { memberId, likeRefId } = input;
		const search: T = { memberId: memberId, likeRefId: likeRefId };
		const result = await this.likeModel.findOne(search).exec();
		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	public async getFavoriteProperties(memberId: ObjectId, input: OrdinaryInquiry): Promise<CoursesList> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.COURSE, memberId: memberId };

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'courses',
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoriteCourse',
					},
				},
				{ $unwind: '$favoriteCourse' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoriteCourse.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		const result: CoursesList = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoriteCourse);
		return result;
	}
}
