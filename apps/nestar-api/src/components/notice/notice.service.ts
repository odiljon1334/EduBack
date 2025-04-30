import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notice } from '../../libs/dto/notice/notice';
import { NoticeInput } from '../../libs/dto/notice/notice.input';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class NoticeService {
	constructor(@InjectModel('Notice') private readonly noticeModel: Model<Notice>) {}

	public async createNotice(input: NoticeInput, memberId: ObjectId): Promise<Notice> {
		try {
			input.memberId = memberId;
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
	// Define your service methods here
}
