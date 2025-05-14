import { MongooseModule } from '@nestjs/mongoose';
import NoticeSchema from '../../schemas/Notice.model';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NoticeResolver } from './notice.resolver';
import { NoticeService } from './notice.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Notice', schema: NoticeSchema }]), AuthModule],
	providers: [NoticeResolver, NoticeService],
	exports: [NoticeService],
})
export class NoticeModule {}
