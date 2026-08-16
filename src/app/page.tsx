// Página inicial simples que renderiza a seção Hero
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-fundo flex flex-col justify-center">
      <main className="w-full">
        {/* Componente Hero com os botões apontando para /disciplinas e /materiais */}
        <Hero />
      </main>
    </div>
  );
}