import { emptyHomeFixture, HomeScreen, registeredHomeFixture } from '@/features/home';

interface HomePageProps {
  searchParams: Promise<{ preview?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { preview } = await searchParams;
  const homeData = preview === 'registered' ? registeredHomeFixture : emptyHomeFixture;

  return <HomeScreen data={homeData} />;
}
