import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';
import { LikeGroup } from '../../enums/like.enum';

@InputType()
export class LikeInput {
	@IsNotEmpty()
	@Field(() => String)
	memberId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	likeRefId: ObjectId;

	@IsNotEmpty()
	@Field(() => LikeGroup)
	likeGroup: LikeGroup;

	@IsOptional()
	@Field(() => String, { nullable: true })
	title?: string;

	@Field(() => String, { nullable: true })
	receiverId?: ObjectId;
}
