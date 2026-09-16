import { myPageFixture, MyPageScreen } from '@/features/mypage';
import { ApiMyPageScreen } from '@/features/mypage/ui/api-profile-screens';
export default function MyPage() { return process.env.NEXT_PUBLIC_API_BASE_URL ? <ApiMyPageScreen /> : <MyPageScreen data={myPageFixture} />; }
