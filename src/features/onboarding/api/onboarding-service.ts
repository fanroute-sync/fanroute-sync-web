import { nicknameSchema } from '@/features/onboarding/model/nickname';
import { checkNicknameAvailability, updateMyNickname } from '@/features/onboarding/api/user-service';

export interface ProfileSetupInput {
  nickname: string;
  profileImage: File | null;
}

export interface OnboardingService {
  checkNickname(nickname: string): Promise<{ available: boolean }>;
  completeProfile(input: ProfileSetupInput): Promise<{ nickname: string }>;
}

const duplicateNicknames = new Set(['팬루트', 'fanroute']);

/** API 명세 확정 전 화면 검증용 fixture. 실제 endpoint로 오인되지 않도록 네트워크를 호출하지 않는다. */
export const onboardingFixtureService: OnboardingService = {
  async checkNickname(nickname) {
    await Promise.resolve();
    return { available: !duplicateNicknames.has(nickname.toLowerCase()) };
  },
  async completeProfile(input) {
    const nickname = nicknameSchema.parse(input.nickname);
    const availability = await this.checkNickname(nickname);

    if (!availability.available) {
      throw new Error('NICKNAME_DUPLICATE');
    }

    return { nickname };
  },
};

export const onboardingApiService: OnboardingService = {
  async checkNickname(nickname) {
    const result = await checkNicknameAvailability(nickname);
    return { available: result.available };
  },
  async completeProfile(input) {
    const nickname = nicknameSchema.parse(input.nickname);
    const result = await checkNicknameAvailability(nickname);
    if (!result.available) throw new Error('NICKNAME_DUPLICATE');
    await updateMyNickname(nickname);
    // The backend currently exposes nickname updates only; image upload is pending API support.
    return { nickname };
  },
};
