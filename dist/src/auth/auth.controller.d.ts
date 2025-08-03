import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    register(registerDto: RegisterDto): Promise<void>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        token: string;
        user: {
            _id: string;
            username: string;
            email: string;
            avatar: string;
        };
    }>;
    getMe(req: any): Promise<import("../user/user.schema").User | null>;
}
