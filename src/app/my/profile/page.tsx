import { myPageFixture, ProfileEditScreen } from '@/features/mypage';
import { ApiProfileEditScreen } from '@/features/mypage/ui/api-profile-screens';
export default function MyProfilePage() { return process.env.NEXT_PUBLIC_API_BASE_URL ? <ApiProfileEditScreen /> : <ProfileEditScreen initialNickname={myPageFixture.profile.nickname} />; }
