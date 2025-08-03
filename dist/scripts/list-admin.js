"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
async function listAdmin() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
        await (0, mongoose_1.connect)(mongoUri);
        const { User, UserSchema } = await Promise.resolve().then(() => require('../src/user/user.schema'));
        const mongoose = await Promise.resolve().then(() => require('mongoose'));
        const UserModel = mongoose.model('User', UserSchema);
        const admins = await UserModel.find({ role: 'admin' }).select('username email role createdAt');
        if (admins.length === 0) {
            console.log('No admin accounts found!');
            return;
        }
        console.log(`Found ${admins.length} admin account(s):`);
        admins.forEach((admin, index) => {
            console.log(`${index + 1}. ${admin.username} (${admin.email})`);
        });
        if (admins.length > 1) {
            console.log('Multiple admin accounts detected!');
        }
    }
    catch (error) {
        console.error('Error listing admin accounts:', error);
    }
    finally {
        await (0, mongoose_1.disconnect)();
    }
}
listAdmin();
//# sourceMappingURL=list-admin.js.map