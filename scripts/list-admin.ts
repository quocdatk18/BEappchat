import { connect, disconnect } from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function listAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
    await connect(mongoUri);

    // Import User model
    const { User, UserSchema } = await import('../src/user/user.schema');
    const mongoose = await import('mongoose');
    const UserModel = mongoose.model('User', UserSchema);

    // Find all admin accounts
    const admins = await UserModel.find({ role: 'admin' }).select(
      'username email role createdAt',
    );

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
  } catch (error) {
    console.error('Error listing admin accounts:', error);
  } finally {
    await disconnect();
  }
}

// Run the script
listAdmin();
