import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, ValidateNested } from 'class-validator';
import { CourseCategory, CourseStatus, CourseType } from '../../enums/course.enum';
import { ObjectId } from 'mongoose';
import { Type } from 'class-transformer';

@InputType()
export class LessonDtoUpdate {
	@IsOptional()
	@Field(() => String, { nullable: true })
	lessonTitle?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	lessonVideo?: string; // Videoga link

	@IsOptional()
	@Field(() => Int, { nullable: true })
	lessonDuration?: number;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	lessonOrder?: number; // Modul ichida lessonlar tartib raqami

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	completedLesson?: boolean;
}

@InputType()
export class ModuleDtoUpdate {
	@IsOptional()
	@Field(() => String, { nullable: true })
	moduleTitle?: string;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	moduleOrder?: number;

	@IsOptional()
	@ValidateNested({ each: true })
	@Field(() => [LessonDtoUpdate], { nullable: true })
	@Type(() => LessonDtoUpdate)
	lessons?: LessonDtoUpdate[];
}

@InputType()
export class CourseUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => CourseType, { nullable: true })
	courseType?: CourseType;

	@IsOptional()
	@Field(() => CourseStatus, { nullable: true })
	courseStatus?: CourseStatus;

	@IsOptional()
	@Field(() => CourseCategory, { nullable: true })
	courseCategory?: CourseCategory;

	@IsOptional()
	@Length(5, 100)
	@Field(() => String, { nullable: true })
	courseTitle?: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	coursePrice?: number;

	@IsOptional()
	@Field(() => String, { nullable: true })
	courseImage?: string;

	@IsOptional()
	@Length(50, 500)
	@Field(() => String, { nullable: true })
	courseDesc?: string;

	@IsOptional()
	@ValidateNested({ each: true })
	@Field(() => [ModuleDtoUpdate], { nullable: true })
	courseModuls?: ModuleDtoUpdate[];

	soldAt?: Date;

	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}
