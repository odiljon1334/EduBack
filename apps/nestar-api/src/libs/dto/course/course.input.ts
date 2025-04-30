import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min, ValidateNested } from 'class-validator';
import { CourseCategory, CourseStatus, CourseType } from '../../enums/course.enum';
import { ObjectId } from 'mongoose';
import { availableCourseSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { Type } from 'class-transformer';

@InputType()
export class LessonDto {
	@IsNotEmpty()
	@Field(() => String)
	lessonTitle: string;

	@IsNotEmpty()
	@Field(() => String)
	lessonVideo: string; // Videoga link

	@IsNotEmpty()
	@Field(() => Int)
	lessonDuration: number;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	completedLesson?: boolean;
}

@InputType('ModuleDTO')
export class ModuleDto {
	@IsNotEmpty()
	@Field(() => String)
	moduleTitle: string;

	@ValidateNested({ each: true })
	@Field(() => [LessonDto])
	@Type(() => LessonDto)
	lessons: LessonDto[];
}

@InputType()
export class CourseInput {
	@IsNotEmpty()
	@Field(() => CourseType)
	courseType: CourseType;

	@IsNotEmpty()
	@Field(() => CourseCategory)
	courseCategory: CourseCategory;

	@IsNotEmpty()
	@Length(5, 100)
	@Field(() => String)
	courseTitle: string;

	@IsNotEmpty()
	@Field(() => Int)
	coursePrice: number;

	@IsNotEmpty()
	@Field(() => String)
	courseImage: string;

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	courseDesc?: string;

	@ValidateNested({ each: true })
	@Field(() => [ModuleDto])
	@IsNotEmpty()
	courseModuls: ModuleDto[];

	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}

@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [CourseCategory], { nullable: true })
	categoryList?: CourseCategory[];

	@IsOptional()
	@Field(() => [CourseType], { nullable: true })
	typeList?: CourseType[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class CoursesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableCourseSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch;
}

@InputType()
export class APISearch {
	@IsOptional()
	@Field(() => CourseStatus, { nullable: true })
	courseStatus?: CourseStatus;
}

@InputType()
export class InstructorCourseInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableCourseSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => APISearch)
	search: APISearch;
}

@InputType()
export class ALPISearch {
	@IsOptional()
	@Field(() => CourseStatus, { nullable: true })
	courseStatus?: CourseStatus;

	@IsOptional()
	@Field(() => [CourseCategory], { nullable: true })
	courseCategory?: CourseCategory[];
}

@InputType()
export class AllCoursesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableCourseSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALPISearch)
	search: ALPISearch;
}

@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}

@InputType()
export class DeleteNotification {
	@IsNotEmpty()
	@Field(() => String)
	authorId: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	receiverId?: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	courseId?: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	articleId?: ObjectId;
}
