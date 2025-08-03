import { connect, disconnect } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface AdminUser {
  username: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  nickname?: string;
  gender: 'male' | 'female';
}

const adminData: AdminUser = {
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
    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
    await connect(mongoUri);

    // Import User model
    const { User, UserSchema } = await import('../src/user/user.schema');
    const mongoose = await import('mongoose');
    const UserModel = mongoose.model('User', UserSchema);

    // Check if ANY admin already exists (chỉ cho phép 1 admin duy nhất)
    const existingAdmin = await UserModel.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log(
        'Admin account already exists! Cannot create multiple admin accounts.',
      );
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin user
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
  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    await disconnect();
  }
}

// Run the script
createAdmin();
