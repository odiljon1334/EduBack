import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notice, NoticeList } from '../../libs/dto/notice/notice';
import { NoticeInput, NoticeInquiry } from '../../libs/dto/notice/notice.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { NoticeUpdateInput } from '../../libs/dto/notice/notice.update';
import { T } from '../../libs/types/common';

@Injectable()
export class NoticeService {
	constructor(@InjectModel('Notice') private readonly noticeModel: Model<Notice>) {}

	public async createNotice(input: NoticeInput): Promise<Notice> {
		try {
			console.log('input', input);
			const result = await this.noticeModel.create(input);
			if (!result) {
				throw new BadRequestException(Message.CREATE_FAILED);
			}
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getNotices(memberId: ObjectId, input: NoticeInquiry): Promise<NoticeList> {
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (input.search.categoryList && input.search?.categoryList.length)
			match.noticeCategory = { $in: input.search?.categoryList };
		if (input.search.typeList && input.search?.typeList.length) match.noticeStatus = { $in: input.search?.typeList };
		if (input.search?.text) match.noticeTitle = { $regex: new RegExp(input.search?.text, 'i') };

		console.log('match', match);

		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							{
								$lookup: {
									from: 'members',
									localField: 'memberId',
									foreignField: '_id',
									as: 'memberData',
								},
							},
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}
	public async updateNotice(input: NoticeUpdateInput): Promise<Notice> {
		let { noticeStatus, memberId, noticeTitle, noticeContent } = input;
		try {
			const updateDate: T = {
				_id: input._id,
				memberId: memberId,
				noticeTitle: '',
				noticeContent: '',
				noticeStatus: '',
			};
			if (noticeStatus) updateDate.noticeStatus = noticeStatus;
			if (noticeTitle) updateDate.noticeTitle = noticeTitle;
			if (noticeContent) updateDate.noticeContent = noticeContent;
			console.log('search', updateDate);
			const result = await this.noticeModel.findByIdAndUpdate(updateDate, input, { new: true }).exec();
			if (!result) {
				throw new BadRequestException(Message.UPDATE_FAILED);
			}
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.UPDATE_FAILED);
		}
	}

	public async removeNotice(noticeId: ObjectId): Promise<Notice> {
		const removeData: T = {
			_id: noticeId,
		};

		const result = await this.noticeModel.findOneAndDelete(removeData).exec();
		if (!result) throw new InternalServerErrorException(Message.DELETE_FAILED);
		return result;
	}
}
