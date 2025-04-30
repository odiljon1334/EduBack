import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Courses, CoursesList } from '../../libs/dto/course/course';
import {
	InstructorCourseInquiry,
	AllCoursesInquiry,
	CourseInput,
	OrdinaryInquiry,
	CoursesInquiry,
} from '../../libs/dto/course/course.input';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CourseUpdate } from '../../libs/dto/course/course.update';

@Resolver()
export class CourseResolver {
	constructor(private readonly courseService: CourseService) {}

	@Roles(MemberType.INSTRUCTOR)
	@UseGuards(RolesGuard)
	@Mutation(() => Courses)
	public async createCourse(
		@Args('input') input: CourseInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Courses> {
		input.memberId = memberId;
		console.log('Mutation: createCourse', input);

		return await this.courseService.createCourse(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Courses)
	public async getCourse(@Args('courseId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Courses> {
		console.log('Query: getCourse');
		const courseId = shapeIntoMongoObjectId(input);
		return await this.courseService.getCourse(memberId, courseId);
	}

	@Roles(MemberType.INSTRUCTOR)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Courses)
	public async updateCourse(
		@Args('input') input: CourseUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Courses> {
		console.log('input', input);
		console.log('Mutation: updateCourse');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.courseService.updateCourse(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => CoursesList)
	public async getCourses(
		@Args('input') input: CoursesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<CoursesList> {
		console.log('Query: getCourses');
		return await this.courseService.getCourses(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => CoursesList)
	public async getFavorites(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<CoursesList> {
		console.log('Query: getFavorites');
		return await this.courseService.getFavorites(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => CoursesList)
	public async getVisited(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<CoursesList> {
		console.log('Query: getVisited');
		return await this.courseService.getVisited(memberId, input);
	}

	@Roles(MemberType.INSTRUCTOR)
	@UseGuards(RolesGuard)
	@Query((returns) => CoursesList)
	public async getInstructorCourses(
		@Args('input') input: InstructorCourseInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<CoursesList> {
		console.log('Query: getInstructorCourse');
		return await this.courseService.getInstructorCourses(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Courses)
	public async likeTargetCourse(
		@Args('courseId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Courses> {
		console.log('Mutation: likeTargetCourse');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.courseService.likeTargetCourse(memberId, likeRefId);
	}
	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => CoursesList)
	public async getAllCoursesByAdmin(
		@Args('input') input: AllCoursesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<CoursesList> {
		console.log('Query: getAllCoursesByAdmin');
		return await this.courseService.getAllCoursesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Courses)
	public async updateCourseByAdmin(
		@Args('input') input: CourseUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Courses> {
		console.log('Mutation: updateCourseByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.courseService.updateCourseByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Courses)
	public async removeCourseByAdmin(@Args('courseId') input: string): Promise<Courses> {
		console.log('Mutation: removeCourseByAdmin');
		const courseId = shapeIntoMongoObjectId(input);
		return await this.courseService.removeCourseByAdmin(courseId);
	}
}
