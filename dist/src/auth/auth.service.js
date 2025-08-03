"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const bcrypt = require("bcrypt");
const JWT_SECRET = 'your_jwt_secret_key';
let AuthService = class AuthService {
    userService;
    jwtService;
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const errors = {};
        const { username, email, password, gender } = registerDto;
        const existingUser = await this.userService.findByUsername(username);
        if (existingUser) {
            errors.username = 'Tên người dùng đã tồn tại';
        }
        const existingEmail = await this.userService.findByEmail(email);
        existingEmail;
        if (existingEmail) {
            errors.email = 'Email đã được sử dụng';
        }
        if (Object.keys(errors).length > 0) {
            errors;
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: errors,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await this.userService.create({
                username,
                email,
                password: hashedPassword,
                gender,
            });
        }
        catch (err) {
            console.error('Lỗi khi lưu user vào MongoDB:', err);
        }
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new common_1.UnauthorizedException('Tên Đăng Nhập không đúng');
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new common_1.UnauthorizedException('Mật khẩu không đúng');
        }
        const payload = {
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        };
        const token = this.jwtService.sign(payload);
        return {
            message: 'Đăng nhập thành công',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map