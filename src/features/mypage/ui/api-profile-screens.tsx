'use client';

import { useQuery } from '@tanstack/react-query';

import { ErrorState, Loading } from '@/components/common';
import { myPageFixture } from '@/features/mypage/fixtures/mypage-fixtures';
import { MyPageScreen } from '@/features/mypage/ui/mypage-screen';
import { ProfileEditScreen } from '@/features/mypage/ui/profile-edit-screen';
import { getMyProfile, usersKeys } from '@/features/onboarding/api/user-service';

function nicknameFromProfile(value: unknown): string | null {
  if (typeof value !== 'object' || value === null || !('nickname' in value)) return null;
  return typeof value.nickname === 'string' ? value.nickname : null;
}

export function ApiMyPageScreen() {
  const profile = useQuery({ queryKey: usersKeys.me(), queryFn: getMyProfile });
  if (profile.isPending) return <Loading />;
  if (profile.isError) return <ErrorState onRetry={() => void profile.refetch()} />;
  return <MyPageScreen showFixtureActivity={false} data={{ ...myPageFixture, profile: { nickname: nicknameFromProfile(profile.data) ?? '여행자', imageUrl: null } }} />;
}

export function ApiProfileEditScreen() {
  const profile = useQuery({ queryKey: usersKeys.me(), queryFn: getMyProfile });
  if (profile.isPending) return <Loading />;
  if (profile.isError) return <ErrorState onRetry={() => void profile.refetch()} />;
  return <ProfileEditScreen initialNickname={nicknameFromProfile(profile.data) ?? ''} />;
}
