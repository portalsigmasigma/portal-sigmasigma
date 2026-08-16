// Importação dos componentes principais (sem o Header)
import Hero from '@/components/Hero';
import Disciplinas from '@/components/Disciplinas';

export default function Home() {
  return (
    // Container principal flexível ocupando a tela com o fundo azul-marinho
    <div className="min-h-screen bg-fundo flex flex-col">
      {/* Conteúdo principal sem o cabeçalho fixo no topo */}
      <main className="flex-1 space-y-6 pb-16">
        {/* Seção Hero de apresentação */}
        <Hero />
        
        {/* Grade de Cards de Disciplinas */}
        <Disciplinas />
      </main>
    </div>
  );
}