import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
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
}
