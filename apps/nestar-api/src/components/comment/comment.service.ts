import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../../libs/dto/comment/comment';

@Injectable()
export class CommentService {
    constructor(@InjectModel('Comment') private readonly commentService: Model<Comment>) {}
}
