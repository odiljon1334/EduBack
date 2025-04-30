import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Notification, NotifList } from '../../libs/dto/notification/notification';
import { NotificationInput, NotifInquiry, Search } from '../../libs/dto/notification/notification.input';
import { Model, ObjectId, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
	lookUpBoardArticle,
	lookUpCourse,
	lookupMember,
	lookUpReceiverData,
	shapeIntoMongoObjectId,
} from '../../libs/config';
import { T } from '../../libs/types/common';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { DeleteNotification } from '../../libs/dto/course/course.input';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

	public async createNotification(input: NotificationInput): Promise<Notification> {
		try {
			const result = await this.notificationModel.create(input);
			if (!result) {
				throw new BadRequestException(Message.CREATE_FAILED);
			}
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getCourseNotifications(memberId: ObjectId, input: NotifInquiry): Promise<NotifList> {
		const { notificationType, notificationGroup } = input.search[0] as Search;

		const match: T = {
			receiverId: memberId,
			notificationStatus: NotificationStatus.WAIT,
		};
		if (notificationType) match.notificationType = { $in: notificationType };
		if (notificationGroup) match.notificationGroup = { $in: notificationGroup };

		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
		// Dinamik lookuplar
		const dynamicLookups: any[] = [];

		// COURSE uchun
		if (notificationGroup?.includes(NotificationGroup.COURSE)) {
			dynamicLookups.push(lookUpCourse, { $unwind: '$courseData' });
		}

		// ARTICLE uchun
		if (notificationGroup?.includes(NotificationGroup.ARTICLE)) {
			dynamicLookups.push(lookUpBoardArticle, { $unwind: { path: '$articleData', preserveNullAndEmptyArrays: true } });
		}

		// MEMBER uchun (Like)
		if (notificationGroup?.includes(NotificationGroup.MEMBER)) {
			dynamicLookups.push(lookUpReceiverData, { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } });
		}

		// Har doim qo‘shiladigan authorData
		dynamicLookups.push(
			{
				$lookup: {
					from: 'members',
					localField: 'authorId',
					foreignField: '_id',
					as: 'authorData',
				},
			},
			{ $unwind: '$authorData' },
		);

		const result = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input?.limit }, { $limit: input?.limit }, ...dynamicLookups],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async deleteNotification(input: DeleteNotification): Promise<void> {
		const match: DeleteNotification = { authorId: input.authorId };
		if (input?.courseId) {
			match.courseId = input?.courseId;
		} else if (input?.articleId) {
			match.articleId = input?.articleId;
		} else if (input?.receiverId) {
			match.receiverId = shapeIntoMongoObjectId(input?.receiverId);
		}
		console.log('deleteNotification', match);

		await this.notificationModel.findOneAndDelete(match).exec();
		if (!match) {
			throw new InternalServerErrorException(Message.REMOVE_FAILED);
		}
	}

	public async updateNotification(input: NotificationUpdate): Promise<Notification> {
		const { receiverId, notificationStatus } = input;

		const search: T = {
			receiverId: shapeIntoMongoObjectId(receiverId),
			notificationStatus: NotificationStatus.WAIT,
		};
		console.log('updateNotification', search);

		const result = await this.notificationModel.findOneAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}
}
