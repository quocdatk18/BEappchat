"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
async function deleteAdmin() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
        await (0, mongoose_1.connect)(mongoUri);
        const { User, UserSchema } = await Promise.resolve().then(() => require('../src/user/user.schema'));
        const mongoose = await Promise.resolve().then(() => require('mongoose'));
        const UserModel = mongoose.model('User', UserSchema);
        const admin = await UserModel.findOne({ role: 'admin' });
        if (!admin) {
            console.log('No admin account found!');
            return;
        }
        console.log('Found admin account:', admin.username);
        await UserModel.deleteOne({ _id: admin._id });
        console.log('Admin account deleted successfully!');
    }
    catch (error) {
        console.error('Error deleting admin account:', error);
    }
    finally {
        await (0, mongoose_1.disconnect)();
    }
}
deleteAdmin();
//# sourceMappingURL=delete-admin.js.map