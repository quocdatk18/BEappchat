import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    _id: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    nickname: string;
    gender: string;
    isOnline: boolean;
    lastSeen: Date;
    role: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
