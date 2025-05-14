import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	COURSE = 'COURSE',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
