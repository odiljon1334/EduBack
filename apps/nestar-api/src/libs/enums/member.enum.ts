import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
	USER = 'USER',
	INSTRUCTOR = 'INSTRUCTOR',
	ADMIN = 'ADMIN',
}
registerEnumType(MemberType, {
	name: 'MemberType',
});

export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	BLOCK = 'BLOCK',
	DELETE = 'DELETE',
}
registerEnumType(MemberStatus, {
	name: 'MemberStatus',
});

export enum MemberAuthType {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL',
	TELEGRAM = 'TELEGRAM',
}
registerEnumType(MemberAuthType, {
	name: 'MemberAuthType',
});

export enum MemberPosition {
	UI_UX_DESIGNER = 'UI/UX DESIGNER',
	SOFTWARE_ENGINEER = 'Software Engineer',
	FRONTEND_DEVELOPER = 'FrontEnd Developer',
	BACKEND_DEVELOPER = 'BackEnd Developer',
	FULLSTACK_DEVELOPER = 'FullStack Developer',
	DATA_SCIENTIST = 'Data Scientist',
	WEB_DEVELOPER = 'Web Developer',
	GRAPHIC_DESIGNER = 'Graphic Designer',
	MOBILE_DEVELOPER = 'Mobile Developer',
	CYBERSECURITY_ENGINEER = 'Cybersecurity Engineer',
	DEVOPS_ENGINEER = 'DevOps Engineer',
	GAME_DEVELOPER = 'Game Developer',
	MACHINE_LEARNING_ENGINEER = 'Machine Learning Engineer',
}
registerEnumType(MemberPosition, {
	name: 'MemberPosition',
});
