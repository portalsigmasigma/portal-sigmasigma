'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import Disciplinas from '@/components/Disciplinas';

export default function Home() {
  // Estado para controlar se as disciplinas estão visíveis ou não
  const [exibirDisciplinas, setExibirDisciplinas] = useState(false);

  // Função para alternar e rolar suavemente até a seção
  const handleToggleDisciplinas = () => {
    const novoEstado = !exibirDisciplinas;
    setExibirDisciplinas(novoEstado);

    if (novoEstado) {
      setTimeout(() => {
        document.getElementById('secao-disciplinas')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-fundo flex flex-col">
      <main className="flex-1 space-y-4 pb-16">
        {/* Passa as propriedades de estado para o Hero */}
        <Hero 
          onToggleDisciplinas={handleToggleDisciplinas} 
          disciplinasAbertas={exibirDisciplinas} 
        />
        
        {/* Renderiza a grade apenas se exibirDisciplinas for true */}
        <Disciplinas visivel={exibirDisciplinas} />
      </main>
    </div>
  );
}