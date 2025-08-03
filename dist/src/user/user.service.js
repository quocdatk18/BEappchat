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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./user.schema");
const mongoose_2 = require("mongoose");
const mongoose_3 = require("mongoose");
const bcrypt = require("bcrypt");
const email_service_1 = require("./email.service");
let UserService = class UserService {
    userModel;
    emailService = new email_service_1.EmailService();
    constructor(userModel) {
        this.userModel = userModel;
    }
    escapeRegexPattern(pattern) {
        return pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    async findByUsername(username) {
        return this.userModel.findOne({ username });
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async create(userData) {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }
    async updateStatus(userId, status) {
        await this.userModel.findByIdAndUpdate(userId, {
            $set: {
                isOnline: status.isOnline,
                ...(status.lastSeen && { lastSeen: status.lastSeen }),
            },
        });
    }
    async getLastSeen(userId) {
        const user = await this.userModel.findById(userId).select('lastSeen');
        return user?.lastSeen ?? null;
    }
    async searchUsers(query, currentUserId) {
        const escapedQuery = this.escapeRegexPattern(query);
        return this.userModel.find({
            $and: [
                {
                    $or: [
                        { username: { $regex: escapedQuery, $options: 'i' } },
                        { nickname: { $regex: escapedQuery, $options: 'i' } },
                        { email: { $regex: escapedQuery, $options: 'i' } },
                    ],
                },
                { _id: { $ne: new mongoose_3.Types.ObjectId(currentUserId) } },
            ],
        }, { password: 0 });
    }
    async searchUserByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error('Mật khẩu hiện tại không chính xác,nếu quên mật khẩu,hãy gửi yêu cầu cấp lại mật khẩu');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
        });
        return true;
    }
    async requestChangeEmail(userId, currentPassword, newEmail, reason) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        const existingUser = await this.userModel.findOne({ email: newEmail });
        if (existingUser && existingUser._id.toString() !== userId) {
            throw new Error('Email already exists');
        }
        await this.emailService.sendMail(process.env.EMAIL_USER || 'your-app@gmail.com', 'Yêu cầu đổi email từ user', `<p>User: ${user.username} (${user.email})</p>
       <p>Email mới: ${newEmail}</p>
       <p>Lý do: ${reason}</p>
       <p>Thời gian yêu cầu: ${new Date().toISOString()}</p>`);
        return true;
    }
    async forgotPassword(email) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new Error('Email not found');
        }
        const newPassword = this.generateRandomPassword();
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.findByIdAndUpdate(user._id, {
            password: hashedNewPassword,
        });
        await this.emailService.sendMail(user.email, 'Mật khẩu mới cho tài khoản của bạn', `<p>Xin chào ${user.username},</p>
       <p>Mật khẩu mới của bạn là: <b>${newPassword}</b></p>
       <p>Hãy đăng nhập và đổi lại mật khẩu nếu cần.</p>`);
        return true;
    }
    generateRandomPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    async updateUser(userId, update) {
        return this.userModel.findByIdAndUpdate(userId, update, { new: true });
    }
    async changeEmail(userId, newEmail) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const oldEmail = user.email;
        await this.userModel.findByIdAndUpdate(userId, { email: newEmail });
        await this.emailService.sendMail(oldEmail, 'Tài khoản của bạn đã được thay đổi email', `<p>Xin chào ${user.username},</p>
       <p>Email tài khoản của bạn vừa được đổi từ <b>${oldEmail}</b> sang <b>${newEmail}</b>.</p>
       <p>Nếu bạn không thực hiện thay đổi này, hãy liên hệ hỗ trợ ngay lập tức!</p>`);
        await this.emailService.sendMail(newEmail, 'Bạn đã đổi email thành công', `<p>Xin chào ${user.username},</p>
       <p>Email của bạn đã được đổi thành công sang địa chỉ này.</p>`);
        return true;
    }
    async sendSupportRequest(supportData) {
        try {
            await this.emailService.sendMail(process.env.EMAIL_USER || 'quocdatlop109@gmail.com', `Yêu cầu hỗ trợ từ ${supportData.username}`, `<h3>Yêu cầu hỗ trợ mới</h3>
         <p><strong>Người gửi:</strong> ${supportData.username}</p>
         <p><strong>Email:</strong> ${supportData.userEmail}</p>
         <p><strong>Tiêu đề:</strong> ${supportData.subject}</p>
         <p><strong>Nội dung:</strong></p>
         <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
           ${supportData.message.replace(/\n/g, '<br>')}
         </div>
         <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>`);
            await this.emailService.sendMail(supportData.userEmail, 'Yêu cầu hỗ trợ đã được gửi', `<p>Xin chào ${supportData.username},</p>
         <p>Yêu cầu hỗ trợ của bạn đã được gửi thành công.</p>
         <p><strong>Tiêu đề:</strong> ${supportData.subject}</p>
         <p>Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
         <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>`);
            return true;
        }
        catch (error) {
            console.error('Error sending support email:', error);
            throw new Error('Failed to send support request');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map