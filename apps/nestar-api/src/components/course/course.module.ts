import { Module } from '@nestjs/common';
import { CourseResolver } from './course.resolver';
import { CourseService } from './course.service';
import { MongooseModule } from '@nestjs/mongoose';
import CourseSchema from '../../schemas/Courses.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { LikeModule } from '../like/like.module';
import { Schema } from 'mongoose';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
		AuthModule,
		ViewModule,
		MemberModule,
		LikeModule,
	],
	providers: [CourseResolver, CourseService],
	exports: [CourseService],
})
export class CourseModule {
	findById(commentRefId: Schema.Types.ObjectId) {
		throw new Error('Method not implemented.');
	}
}
