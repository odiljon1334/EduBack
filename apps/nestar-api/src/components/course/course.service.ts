import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
	InstructorCourseInquiry,
	AllCoursesInquiry,
	CourseInput,
	OrdinaryInquiry,
	CoursesInquiry,
} from '../../libs/dto/course/course.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import * as moment from 'moment';
import { LikeService } from '../like/like.service';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeInput } from '../../libs/dto/like/like.input';
import { Courses, CoursesList } from '../../libs/dto/course/course';
import { CourseStatus } from '../../libs/enums/course.enum';
import { CourseUpdate } from '../../libs/dto/course/course.update';

@Injectable()
export class CourseService {
	constructor(
		@InjectModel('Course') private readonly courseModel: Model<Courses>,
		private memberService: MemberService,
		private viewService: ViewService,
		private likeService: LikeService,
	) {}
	public async createCourse(input: CourseInput): Promise<Courses> {
		try {
			const result = await this.courseModel.create(input);
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberCourses',
				modifier: 1,
			});
			return result;
		} catch (err) {
			console.log('ERROR: createCourse:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getCourse(memberId: ObjectId, courseId: ObjectId): Promise<Courses> {
		const search: T = {
			_id: courseId,
			courseStatus: CourseStatus.ACTIVE,
		};

		const targetCourse: Courses = await this.courseModel.findOne(search).lean<Courses>().exec();
		if (!targetCourse) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: courseId, viewGroup: ViewGroup.COURSE };
			const newWiew = await this.viewService.recordView(viewInput);

			if (newWiew) {
				await this.courseStatsEditor({ _id: courseId, targetKey: 'courseViews', modifier: 1 });
				targetCourse.courseViews++;
			}

			const likeInput = { memberId: memberId, likeRefId: courseId, likeGroup: LikeGroup.COURSE };
			targetCourse.meLiked = await this.likeService.checkLikeExistence(likeInput);
		}

		targetCourse.memberData = await this.memberService.getMember(null, targetCourse.memberId);
		return targetCourse;
	}

	public async updateCourse(memberId: ObjectId, input: CourseUpdate): Promise<Courses> {
		let { courseStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			memberId: memberId,
			courseStatus: CourseStatus.ACTIVE,
		};

		if (courseStatus === CourseStatus.SOLD) soldAt = moment().toDate();
		else if (courseStatus === CourseStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.courseModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberCourses',
				modifier: -1,
			});
		}

		return result;
	}

	public async getCourses(memberId: ObjectId, input: CoursesInquiry): Promise<CoursesList> {
		const match: T = { courseStatus: CourseStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('match:', match);

		const result = await this.courseModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthMemberLiked(memberId),
							lookupMember,
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

	public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<CoursesList> {
		return await this.likeService.getFavoriteProperties(memberId, input);
	}

	public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<CoursesList> {
		const result = await this.viewService.getVisitedCourses(memberId, input);
		return result;
	}

	private shapeMatchQuery(match: T, input: CoursesInquiry): void {
		const { memberId, categoryList, typeList, text } = input.search;

		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
		if (categoryList && categoryList.length) match.courseCategory = { $in: categoryList };
		if (typeList && typeList.length) match.courseType = { $in: typeList };

		if (text) match.courseTitle = { $regex: new RegExp(text, 'i') };
	}

	public async getInstructorCourses(memberId: ObjectId, input: InstructorCourseInquiry): Promise<CoursesList> {
		const { courseStatus } = input.search;
		if (courseStatus === CourseStatus.DELETE) throw new InternalServerErrorException(Message.NOT_ALLOWED_REQUEST);

		const match: T = {
			memberId: memberId,
			courseStatus: courseStatus ?? { $ne: CourseStatus.DELETE },
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.courseModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
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

	public async likeTargetCourse(memberId: ObjectId, likeRefId: ObjectId): Promise<Courses> {
		const target: Courses = await this.courseModel
			.findOne({ _id: likeRefId, courseStatus: CourseStatus.ACTIVE })
			.exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.COURSE,
		};

		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.courseStatsEditor({
			_id: likeRefId,
			targetKey: 'courseLikes',
			modifier: modifier,
		});

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	public async getAllCoursesByAdmin(input: AllCoursesInquiry): Promise<CoursesList> {
		const { courseStatus, courseCategory } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (courseStatus) match.courseStatus = courseStatus;
		if (courseCategory) match.courseCategory = { $in: courseCategory };

		const result = await this.courseModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
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

	public async updateCourseByAdmin(input: CourseUpdate): Promise<Courses> {
		let { courseStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			courseStatus: CourseStatus.ACTIVE,
		};

		if (courseStatus === CourseStatus.SOLD) soldAt = moment().toDate();
		else if (courseStatus === CourseStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.courseModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberCourses',
				modifier: -1,
			});
		}
		return result;
	}

	public async removeCourseByAdmin(courseId: ObjectId): Promise<Courses> {
		const search: T = { _id: courseId, courseStatus: CourseStatus.DELETE };
		const result = await this.courseModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}

	public async courseStatsEditor(input: StatisticModifier): Promise<Courses> {
		const { _id, targetKey, modifier } = input;
		return await this.courseModel
			.findOneAndUpdate(
				{ _id },
				{
					$inc: { [targetKey]: modifier },
				},
				{
					new: true,
				},
			)
			.exec();
	}
}
