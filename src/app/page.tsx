// Importação dos componentes isolados
import Header from '@/components/Header';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    // Estrutura principal flexível ocupando toda a altura da tela
    <div className="min-h-screen bg-fundo flex flex-col">
      {/* 1. Barra de navegação do topo */}
      <Header />

      {/* 2. Conteúdo central da página */}
      <main className="flex-1">
        {/* Componente Hero com apresentação e aviso humorado */}
        <Hero />
      </main>
    </div>
  );
}