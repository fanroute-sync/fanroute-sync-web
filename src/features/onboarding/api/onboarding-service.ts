import { nicknameSchema } from '@/features/onboarding/model/nickname';

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
