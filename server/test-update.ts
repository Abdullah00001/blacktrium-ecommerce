import mongoose from 'mongoose';
import { ProfileModel } from './src/app/schemas/profile/profile.schema';
import { UserModel } from './src/app/schemas/user/user.schema';

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || '');
  
  // Create user
  const u = await UserModel.create({
    firstName: 'T', lastName: 'U', email: 'test_interest@t.com', password: '123', country: 'US', phone: '+123'
  });
  
  // Create profile
  const p = await ProfileModel.create({
    userId: u._id, country: 'US', interest: []
  });
  
  console.log('Before update:', p.interest);
  
  const payload = { interest: ['football', 'music'] };
  const { country, profileAvatar, interest } = payload as any;
  
  const updatedProfile = await ProfileModel.findOneAndUpdate(
    { userId: u._id },
    { $set: { country, profileAvatar, interest } },
    { returnDocument: 'after' }
  );
  
  console.log('After update:', updatedProfile?.interest);
  process.exit(0);
}
test().catch(console.error);
