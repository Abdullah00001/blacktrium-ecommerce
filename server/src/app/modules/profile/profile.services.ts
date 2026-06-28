/* eslint-disable no-useless-catch */
import { IUser } from '@/app/schemas/user/user.types';
import { TProfilePayload } from '@/app/modules/profile/profile.schemas';
import { ProfileModel } from '@/app/schemas/profile/profile.schema';
import { UserModel } from '@/app/schemas/user/user.schema';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { IProfile } from '@/app/schemas/profile/profile.types';

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
      email: updatedUser.email,
      phone: updatedUser.phone,
      profileAvatar: updatedProfile.profileAvatar,
      country: updatedProfile.country,
      interest: updatedProfile.interest,
      role: updatedUser.role,
    };
  } catch (error) {
    throw error;
  }
};

export const getMyProfileService = async ({
  profile,
  user,
}: {
  user: IUser;
  profile: IProfile;
}): Promise<unknown> => {
  try {
    const businessProfile = await BusinessProfileModel.findOne({ userId: user._id }).select('_id status');

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      profileAvatar: profile.profileAvatar,
      country: profile.country,
      interest: profile.interest,
      role: user.role,
      businessProfileStatus: businessProfile ? businessProfile.status : 'inactive',
      businessProfileId: businessProfile ? businessProfile._id : null,
    };
  } catch (error) {
    throw error;
  }
};
