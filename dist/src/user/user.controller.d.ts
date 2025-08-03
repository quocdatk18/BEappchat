import { UserService } from './user.service';
import { User } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestChangeEmailDto } from './dto/request-change-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { SupportRequestDto } from './dto/support-request.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(user: User): Promise<User | null>;
    searchUsers(query: string, user: User): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    searchUserByEmail(email: string, user: User): Promise<User | null>;
    getUserById(id: string): Promise<User | null>;
    changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    requestChangeEmail(user: User, requestChangeEmailDto: RequestChangeEmailDto): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    adminChangeEmail(user: User, changeEmailDto: ChangeEmailDto): Promise<{
        message: string;
    }>;
    sendSupportRequest(supportRequestDto: SupportRequestDto): Promise<{
        message: string;
    }>;
    updateOnlineStatus(id: string, body: {
        isOnline: boolean;
    }, user: User): Promise<{
        message: string;
    }>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
}
