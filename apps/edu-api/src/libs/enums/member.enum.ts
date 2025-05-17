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
	UI_UX_DESIGNER = 'UI_UX_DESIGNER',
	SOFTWARE_ENGINEER = 'SOFTWARE_ENGINEER',
	FRONTEND_DEVELOPER = 'FRONTEND_DEVELOPER',
	BACKEND_DEVELOPER = 'BACKEND_DEVELOPER',
	FULLSTACK_DEVELOPER = 'FULLSTACK_DEVELOPER',
	DATA_SCIENTIST = 'DATA_SCIENTIST',
	WEB_DEVELOPER = 'WEB_DEVELOPER',
	GRAPHIC_DESIGNER = 'GRAPHIC_DESIGNER',
	MOBILE_DEVELOPER = 'MOBILE_DEVELOPER',
	DEVOPS_ENGINEER = 'DEVOPS_ENGINEER',
	GAME_DEVELOPER = 'GAME_DEVELOPER',
	MACHINE_LEARNING_ENGINEER = 'MACHINE_LEARNING_ENGINEER',
	STUDENT = 'STUDENT',
}
registerEnumType(MemberPosition, {
	name: 'MemberPosition',
});
