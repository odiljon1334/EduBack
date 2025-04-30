import { model, Schema } from 'mongoose';
import LessonSchema from './Lesson.model';

const ModuleSchema = new Schema(
	{
		moduleTitle: {
			type: String,
			required: true,
		},
		lessons: {
			type: [LessonSchema],
		}, // Module ichida Lessonlar bo‘ladi

		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true, collection: 'modules' },
);

export default ModuleSchema;
