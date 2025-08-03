"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const adminData = {
    username: 'superadmin',
    email: 'admin@chatapp.com',
    password: 'admin123456',
    role: 'admin',
    avatar: '/avtDefault.png',
    nickname: 'Super Admin',
    gender: 'male',
};
async function createAdmin() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
        await (0, mongoose_1.connect)(mongoUri);
        const { User, UserSchema } = await Promise.resolve().then(() => require('../src/user/user.schema'));
        const mongoose = await Promise.resolve().then(() => require('mongoose'));
        const UserModel = mongoose.model('User', UserSchema);
        const existingAdmin = await UserModel.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin account already exists! Cannot create multiple admin accounts.');
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
        const adminUser = new UserModel({
            ...adminData,
            password: hashedPassword,
            isOnline: false,
            lastSeen: new Date(),
        });
        await adminUser.save();
        console.log('Super Admin account created successfully!');
        console.log('Username:', adminData.username);
        console.log('Password:', adminData.password);
    }
    catch (error) {
        console.error('Error creating admin account:', error);
    }
    finally {
        await (0, mongoose_1.disconnect)();
    }
}
createAdmin();
//# sourceMappingURL=create-admin.js.map