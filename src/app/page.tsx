import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-fundo flex flex-col justify-center">
      <main className="w-full">
        <Hero />
      </main>
    </div>
  );
}