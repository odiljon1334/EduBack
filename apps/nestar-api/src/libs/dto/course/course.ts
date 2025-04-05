import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { CourseCategory, CourseStatus, CourseType } from '../../enums/course.enum';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType('Lesson')
export class LessonDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	lessonTitle: string;

	@Field(() => Int)
	lessonOrder: number; // Modul ichida lessonlar tartib raqami

	@Field(() => String)
	lessonVideo: string; // Videoga link

	@Field(() => Boolean, { nullable: true })
	completedLesson?: boolean;

	@Field(() => Int)
	lessonDuration: number;
}

@ObjectType('Module')
export class ModuleDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	moduleTitle: string;

	@Field(() => Int)
	moduleOrder: number;

	@Field(() => [LessonDto])
	lessons: LessonDto[];
}

@ObjectType()
export class Courses {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => CourseType)
	courseType: CourseType;

	@Field(() => CourseStatus)
	courseStatus: CourseStatus;

	@Field(() => CourseCategory)
	courseCategory: CourseCategory;

	@Field(() => String)
	courseTitle: string;

	@Field(() => Int)
	coursePrice: number;

	@Field(() => Int)
	courseViews: number;

	@Field(() => Int)
	courseLikes: number;

	@Field(() => Int)
	courseComments: number;

	@Field(() => Int)
	courseRank: number;

	@Field(() => String)
	courseImage: string;

	@Field(() => String, { nullable: true })
	courseDesc?: string;

	@Field(() => [ModuleDto])
	courseModuls: ModuleDto[];

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	soldAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date, { nullable: true })
	updatedAt?: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];
}

@ObjectType()
export class CoursesList {
	@Field(() => [Courses])
	list: Courses[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
