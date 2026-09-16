import { emptyHomeFixture, HomeScreen, registeredHomeFixture } from '@/features/home';
import { ApiHomeScreen } from '@/features/home/ui/api-home-screen';

interface HomePageProps {
  searchParams: Promise<{ preview?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { preview } = await searchParams;
  if (process.env.NEXT_PUBLIC_API_BASE_URL && !preview) return <ApiHomeScreen />;
  const homeData = preview === 'registered' ? registeredHomeFixture : emptyHomeFixture;

  return <HomeScreen data={homeData} />;
}
