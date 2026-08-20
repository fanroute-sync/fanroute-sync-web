import { myPageFixture, ProfileEditScreen } from '@/features/mypage';
export default function MyProfilePage() { return <ProfileEditScreen initialNickname={myPageFixture.profile.nickname} />; }
