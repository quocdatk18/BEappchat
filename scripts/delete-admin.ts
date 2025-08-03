import { connect, disconnect } from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function deleteAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
    await connect(mongoUri);

    // Import User model
    const { User, UserSchema } = await import('../src/user/user.schema');
    const mongoose = await import('mongoose');
    const UserModel = mongoose.model('User', UserSchema);

    // Find admin account (chỉ tìm theo role)
    const admin = await UserModel.findOne({ role: 'admin' });

    if (!admin) {
      console.log('No admin account found!');
      return;
    }

    console.log('Found admin account:', admin.username);

    // Delete admin account
    await UserModel.deleteOne({ _id: admin._id });

    console.log('Admin account deleted successfully!');
  } catch (error) {
    console.error('Error deleting admin account:', error);
  } finally {
    await disconnect();
  }
}

// Run the script
deleteAdmin();
