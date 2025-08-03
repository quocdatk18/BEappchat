import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
export declare class UserService {
    private userModel;
    private emailService;
    constructor(userModel: Model<UserDocument>);
    private escapeRegexPattern;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    updateStatus(userId: string, status: {
        isOnline: boolean;
        lastSeen?: Date;
    }): Promise<void>;
    getLastSeen(userId: string): Promise<Date | null>;
    searchUsers(query: string, currentUserId: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    searchUserByEmail(email: string): Promise<User | null>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
    requestChangeEmail(userId: string, currentPassword: string, newEmail: string, reason: string): Promise<boolean>;
    forgotPassword(email: string): Promise<boolean>;
    private generateRandomPassword;
    updateUser(userId: string, update: Partial<User>): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    changeEmail(userId: string, newEmail: string): Promise<boolean>;
    sendSupportRequest(supportData: {
        subject: string;
        message: string;
        userEmail: string;
        username: string;
    }): Promise<boolean>;
}
