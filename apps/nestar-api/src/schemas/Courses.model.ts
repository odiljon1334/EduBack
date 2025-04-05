import { Schema } from 'mongoose';
import { CourseCategory, CourseStatus, CourseType } from '../libs/enums/course.enum';
import ModuleSchema from './Module.model';

const CourseSchema = new Schema(
	{
		CourseType: {
			type: String,
			enum: CourseType,
			required: true,
		},

		CourseStatus: {
			type: String,
			enum: CourseStatus,
			default: CourseStatus.ACTIVE,
		},

		courseCategory: {
			type: String,
			enum: CourseCategory,
			required: true,
		},

		courseTitle: {
			type: String,
			required: true,
		},

		coursePrice: {
			type: Number,
			required: true,
		},

		courseViews: {
			type: Number,
			default: 0,
		},

		courseLikes: {
			type: Number,
			default: 0,
		},

		courseComments: {
			type: Number,
			default: 0,
		},

		courseRank: {
			type: Number,
			default: 0,
		},

		courseModuls: {
			type: [ModuleSchema],
		},

		courseImage: {
			type: String,
			required: true,
		},

		courseDesc: {
			type: String,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},

		constructedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'courses' },
);

export default CourseSchema;
