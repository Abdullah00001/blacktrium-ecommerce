import { IUser } from '@/app/schemas/user/user.types';
import { TProfilePayload } from '@/app/modules/profile/profile.schemas';
import { ProfileModel } from '@/app/schemas/profile/profile.schema';
import { UserModel } from '@/app/schemas/user/user.schema';

export const updateProfileService = async ({
  payload,
  user,
}: {
  user: IUser;
  payload: TProfilePayload;
}): Promise<unknown> => {
  try {
    const { country, firstName, lastName, phone, profileAvatar, interest } =
      payload;
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: user._id,
      },
      { $set: { firstName, lastName, phone } },
      { returnDocument: 'after' }
    );
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      {
        userId: user._id,
      },
      { $set: { country, profileAvatar, interest } },
      { returnDocument: 'after' }
    );
    if (!updatedProfile || !updatedUser)
      throw new Error('Profile update failed');
    return {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      profileAvatar: updatedProfile.profileAvatar,
      country: updatedProfile.country,
      interest: updatedProfile.interest,
    };
  } catch (error) {
    throw error;
  }
};
