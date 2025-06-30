import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification, NotifList } from '../../libs/dto/notification/notification';
import { NotifInquiry } from '../../libs/dto/notification/notification.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@UseGuards(WithoutGuard)
	@Query(() => NotifList)
	public async getCourseNotifications(
		@Args('input') input: NotifInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<NotifList> {
		console.log('getCourseNotifications');
		return await this.notificationService.getCourseNotifications(memberId, input);
	}

	@Roles(MemberType.INSTRUCTOR)
	@UseGuards(RolesGuard)
	@Mutation(() => Notification)
	public async updateNotification(@Args('input') input: NotificationUpdate): Promise<Notification> {
		console.log('Mutation: updateNotification');
		return await this.notificationService.updateNotification(input);
	}
}
