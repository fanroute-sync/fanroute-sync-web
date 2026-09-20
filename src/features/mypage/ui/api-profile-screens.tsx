'use client';

import { useQuery } from '@tanstack/react-query';

import { ErrorState, Loading } from '@/components/common';
import { myPageFixture } from '@/features/mypage/fixtures/mypage-fixtures';
import { MyPageScreen } from '@/features/mypage/ui/mypage-screen';
import { ProfileEditScreen } from '@/features/mypage/ui/profile-edit-screen';
import { getMyProfile, usersKeys } from '@/features/onboarding/api/user-service';

export function ApiMyPageScreen() {
  const profile = useQuery({ queryKey: usersKeys.me(), queryFn: getMyProfile });
  if (profile.isPending) return <Loading />;
  if (profile.isError) return <ErrorState onRetry={() => void profile.refetch()} />;
  return <MyPageScreen showFixtureActivity={false} data={{ ...myPageFixture, profile: { nickname: profile.data.nickname, imageUrl: null } }} />;
}

export function ApiProfileEditScreen() {
  const profile = useQuery({ queryKey: usersKeys.me(), queryFn: getMyProfile });
  if (profile.isPending) return <Loading />;
  if (profile.isError) return <ErrorState onRetry={() => void profile.refetch()} />;
  return <ProfileEditScreen initialNickname={profile.data.nickname} />;
}
