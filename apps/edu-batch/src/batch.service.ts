import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/edu-api/src/libs/dto/member/member';
import { Courses } from 'apps/edu-api/src/libs/dto/course/course';
import { MemberStatus, MemberType } from 'apps/edu-api/src/libs/enums/member.enum';
import { CourseStatus } from 'apps/edu-api/src/libs/enums/course.enum';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Course') private readonly courseModel: Model<Courses>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	public async batchRollBack(): Promise<void> {
		await this.courseModel
			.updateMany(
				{
					courseStatus: CourseStatus.ACTIVE,
				},
				{ courseRank: 0 },
			)
			.exec();

		await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
					memberType: MemberType.INSTRUCTOR,
				},
				{ memberRank: 0 },
			)
			.exec();
	}

	public async batchTopCourses(): Promise<void> {
		const coursesMap: Courses[] = await this.courseModel
			.find({
				courseStatus: CourseStatus.ACTIVE,
				courseRank: 0,
			})
			.exec();

		const promisedList = coursesMap.map(async (ele: Courses) => {
			const { _id, courseLikes, courseViews } = ele;
			const rank = courseLikes * 2 + courseViews * 1;
			return await this.courseModel.findByIdAndUpdate(_id, { courseRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async batchTopInstructors(): Promise<void> {
		const instructors: Member[] = await this.memberModel
			.find({
				memberType: MemberType.INSTRUCTOR,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = instructors.map(async (ele: Member) => {
			const { _id, memberCourses, memberLikes, memberArticles, memberViews } = ele;
			const rank = memberCourses * 4 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promisedList);
	}

	public getHello(): string {
		return 'Welcome to Edu-Batch Server!';
	}
}
