import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { NotificationModule } from './notification/notification.module';
import { NoticeModule } from './notice/notice.module';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		CourseModule,
		BoardArticleModule,
		NotificationModule,
		LikeModule,
		ViewModule,
		CommentModule,
		FollowModule,
		NoticeModule,
	],
})
export class ComponentsModule {}
