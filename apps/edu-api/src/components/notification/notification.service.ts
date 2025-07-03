import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Notification, NotifList } from '../../libs/dto/notification/notification';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
	lookUpArticle,
	lookUpAuthorData,
	lookUpCourse,
	lookupFollowerNotitifcation,
	lookUpMemberNotification,
	shapeIntoMongoObjectId,
} from '../../libs/config';
import { T } from '../../libs/types/common';
import { NotificationStatus } from '../../libs/enums/notification.enum';
import { Message } from '../../libs/enums/common.enum';
import { DeleteNotification } from '../../libs/dto/course/course.input';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Notification')
		private readonly notificationModel: Model<Notification>,
		private readonly eventEmitter: EventEmitter2,
	) {}

	public async createNotification(input: NotificationInput): Promise<Notification> {
		try {
			const result = await this.notificationModel.create(input);
			if (!result) {
				throw new BadRequestException(Message.CREATE_FAILED);
			}
			this.eventEmitter.emit('notification', result.receiverId);
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getNotifications(memberId: ObjectId): Promise<NotifList> {
		const match: T = {
			receiverId: memberId,
			notificationStatus: NotificationStatus.WAIT,
		};
		const sort: T = { createdAt: -1 };

		const result: NotifList[] = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: 0 },
							{ $limit: 100 },
							lookUpAuthorData,
							{ $unwind: '$authorData' },
							lookUpCourse,
							{ $unwind: '$courseData' },
							lookUpArticle,
							{ $unwind: { path: '$articleData', preserveNullAndEmptyArrays: true } },
							lookUpMemberNotification,
							{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
							lookupFollowerNotitifcation,
							{ $unwind: { path: '$followData', preserveNullAndEmptyArrays: true } },
						],
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
		const { receiverId } = input;

		const search: T = {
			receiverId: shapeIntoMongoObjectId(receiverId),
			notificationStatus: NotificationStatus.WAIT,
		};
		console.log('updateNotification', search);

		const result = await this.notificationModel.findOneAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		this.eventEmitter.emit('notification', result.receiverId);

		return result;
	}
}
