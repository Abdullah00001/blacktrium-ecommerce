import mongoose from 'mongoose';
import { ProfileModel } from './server/src/app/schemas/profile/profile.schema';
import { UserModel } from './server/src/app/schemas/user/user.schema';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://blacktrium_root:blacktrium_root_password@localhost:27017/blacktrium_ecommerce?authSource=admin');
  
  // Create a mock user
  const user = await UserModel.create({
    email: 'test' + Date.now() + '@example.com',
    password: 'password',
    firstName: 'Test',
    lastName: 'User',
    country: 'US',
    phone: '+1234567890'
  });

  const profile = await ProfileModel.create({
    userId: user._id,
    country: 'US'
  });

  console.log('Before:', profile);

  const payload = { interest: ['football', 'music'] };
  const { country, profileAvatar, interest } = payload as any;

  const updatedProfile = await ProfileModel.findOneAndUpdate(
    { userId: user._id },
    { $set: { country, profileAvatar, interest } },
    { returnDocument: 'after' }
  );

  console.log('After:', updatedProfile);
  process.exit(0);
}
test().catch(console.error);
