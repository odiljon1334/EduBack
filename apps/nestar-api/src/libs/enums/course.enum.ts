import { registerEnumType } from '@nestjs/graphql';

export enum CourseType {
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCED = 'ADVANCED',
}
registerEnumType(CourseType, {
	name: 'CourseType',
});

export enum CourseStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	INACTIVE = 'INACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(CourseStatus, {
	name: 'CourseStatus',
});

export enum CourseCategory {
	JAVASCRIPT = 'JAVASCRIPT',
	TYPESCRIPT = 'TYPESCRIPT',
	PYTHON = 'PYTHON',
	WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
	MOBILE_DEVELOPMENT = 'MOBILE_DEVELOPMENT',
	DATA_SCIENCE = 'DATA_SCIENCE',
	UI_UX_DESIGN = 'UI_UX_DESIGN',
	DEVOPS = 'DEVOPS',
}
registerEnumType(CourseCategory, {
	name: 'CourseCategory',
});
