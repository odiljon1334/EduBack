import { Schema } from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../libs/enums/member.enum";

const MemberSchema = new Schema({
    memberType: {
        type: String,
        enum: MemberType,
        default: MemberType.USER,
    },

    memberStatus: {
        type: String,
        enum: MemberStatus,
        default: MemberStatus.ACTIVE,
    },

    memberAuthType: {
        type: String,
        enum: MemberAuthType,
        default: MemberAuthType.PHONE,
    },

    memberPhone: {
        type: String,
        index: { unique: true, sparse: true},
        required: true,
    },

    memberNick: {
        type: String,
        index: { unique: true, sparse: true },
        required: true,
    },

    memberPassword: {
        type: String,
        select: false,
        required: true,
    },

    memberFullName: {
        type: String,
    },

    member
})