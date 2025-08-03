# Admin Scripts

Các script để quản lý Super Admin account.

## ⚠️ Lưu ý quan trọng

**Các file script này KHÔNG được push lên Git** vì chứa thông tin nhạy cảm.

## 📁 Files

- `create-admin.ts` - Tạo Super Admin account
- `delete-admin.ts` - Xóa Admin account
- `list-admin.ts` - Liệt kê Admin accounts

## 🚀 Cách sử dụng

### 1. Tạo Admin Scripts

```bash
# Tạo file create-admin.ts
cat > server/scripts/create-admin.ts << 'EOF'
import { connect, disconnect } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adminData = {
  username: 'superadmin',
  email: 'admin@chatapp.com',
  password: 'admin123456',
  role: 'admin',
  avatar: '/avtDefault.png',
  nickname: 'Super Admin',
  gender: 'male'
};

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
    console.log('🔗 Connecting to MongoDB...');
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const { User, UserSchema } = await import('../src/user/user.schema');
    const mongoose = await import('mongoose');
    const UserModel = mongoose.model('User', UserSchema);

    const existingAdmin = await UserModel.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('');
      console.log('❌ Cannot create multiple admin accounts!');
      console.log('💡 Use "npm run delete-admin" to remove existing admin first.');
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

    console.log('✅ Super Admin account created successfully!');
    console.log('📋 Account details:');
    console.log('   Username:', adminData.username);
    console.log('   Email:', adminData.email);
    console.log('   Password:', adminData.password);
    console.log('   Role:', adminData.role);
    console.log('');
    console.log('🔐 Login credentials:');
    console.log('   Username/Email:', adminData.username);
    console.log('   Password:', adminData.password);
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  } finally {
    await disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdmin();
EOF

# Tạo file delete-admin.ts
cat > server/scripts/delete-admin.ts << 'EOF'
import { connect, disconnect } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function deleteAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
    console.log('🔗 Connecting to MongoDB...');
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const { User, UserSchema } = await import('../src/user/user.schema');
    const mongoose = await import('mongoose');
    const UserModel = mongoose.model('User', UserSchema);

    const admin = await UserModel.findOne({ role: 'admin' });

    if (!admin) {
      console.log('❌ No admin account found!');
      return;
    }

    console.log('⚠️  Found admin account:');
    console.log('   Username:', admin.username);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);

    await UserModel.deleteOne({ _id: admin._id });
    console.log('✅ Admin account deleted successfully!');

  } catch (error) {
    console.error('❌ Error deleting admin account:', error);
  } finally {
    await disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

deleteAdmin();
EOF

# Tạo file list-admin.ts
cat > server/scripts/list-admin.ts << 'EOF'
import { connect, disconnect } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function listAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
    console.log('🔗 Connecting to MongoDB...');
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const { User, UserSchema } = await import('../src/user/user.schema');
    const mongoose = await import('mongoose');
    const UserModel = mongoose.model('User', UserSchema);

    const admins = await UserModel.find({ role: 'admin' }).select('username email role createdAt');

    if (admins.length === 0) {
      console.log('❌ No admin accounts found!');
      console.log('💡 Use "npm run create-admin" to create one.');
      return;
    }

    console.log(`📋 Found ${admins.length} admin account(s):`);
    console.log('');

    admins.forEach((admin, index) => {
      console.log(`${index + 1}. Admin Account:`);
      console.log(`   Username: ${admin.username}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Created: ${(admin as any).createdAt}`);
      console.log('');
    });

    if (admins.length > 1) {
      console.log('⚠️  Multiple admin accounts detected!');
      console.log('💡 Consider using "npm run delete-admin" to remove extras.');
    }

  } catch (error) {
    console.error('❌ Error listing admin accounts:', error);
  } finally {
    await disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

listAdmin();
EOF
```

### 2. Thêm scripts vào package.json

```bash
# Thêm vào server/package.json trong phần "scripts"
"create-admin": "ts-node scripts/create-admin.ts",
"delete-admin": "ts-node scripts/delete-admin.ts",
"list-admin": "ts-node scripts/list-admin.ts"
```

### 3. Sử dụng

```bash
# Kiểm tra admin hiện tại
npm run list-admin

# Tạo admin (chỉ 1 duy nhất)
npm run create-admin

# Xóa admin hiện tại
npm run delete-admin
```

## 🔐 Thông tin Admin

- **Username**: `superadmin`
- **Email**: `admin@chatapp.com`
- **Password**: `admin123456`
- **Role**: `admin`

## ⚠️ Bảo mật

- Scripts chứa thông tin nhạy cảm
- **KHÔNG push lên Git**
- Chỉ sử dụng trong môi trường development
- Thay đổi password sau khi tạo
