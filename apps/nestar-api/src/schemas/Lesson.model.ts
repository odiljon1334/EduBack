import { Schema } from 'mongoose';

const LessonSchema = new Schema(
	{
		lessonTitle: {
			type: String,
			required: true,
		},

		lessonVideo: {
			type: String,
			required: true,
		}, // Videoga link

		lessonDuration: {
			type: Number,
			required: true,
		},

		lessonOrder: {
			type: Number,
			required: true,
		}, // Modul ichida lessonlar tartib raqami

		completedLesson: {
			type: Boolean,
			default: false,
		},

		createdAt: {
			type: Date,
			default: Date.now,
		},

		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true, collection: 'lessons' },
);

export default LessonSchema;
