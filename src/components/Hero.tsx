'use client';

import { useState } from 'react';
import Link from 'next/link';
import ModalContribuir from './ModalContribuir';

export default function Hero() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <section className="flex flex-col items-center justify-center text-center space-y-6 py-12 sm:py-16 px-4 w-full max-w-full">
        
        {/* Badge do topo */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-azul-texto">
          <span>⚡ De estudante para estudante</span>
        </div>

        {/* Sigmas Iluminados */}
        <div className="text-5xl sm:text-7xl font-extrabold tracking-widest text-azul-texto glow-sigma select-none">
          ΣΣ
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl font-black text-texto-principal tracking-tight max-w-3xl leading-tight">
          Portal de <span className="text-azul-texto">Σngenharia</span> <span className="text-azul-texto">Σlétrica</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-xs sm:text-sm text-texto-secundario max-w-xl leading-relaxed">
          Um repositório <strong className="text-texto-principal">100% independente</strong> — feito por pura vontade de sobreviver ao curso, sem qualquer vínculo, benção ou dedo da representação do colegiado.
          <br />
          Criado para salvar a pele e facilitar a vida dos eletricistas ceféticos! ⚡ ⚙️
        </p>

        {/* Botões de Ação Principais */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-2xl">
          <Link
            href="/disciplinas"
            className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl bg-destaque hover:bg-blue-600 text-white font-semibold transition-all shadow-lg shadow-cyan-500/10 text-xs sm:text-sm text-center active:scale-95 whitespace-nowrap"
          >
            Disciplinas 📚
          </Link>

          <Link
            href="/professores"
            className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl bg-card border border-borda hover:border-azul-texto text-texto-principal font-semibold transition-all text-xs sm:text-sm text-center active:scale-95 whitespace-nowrap"
          >
            Professores 👨‍🏫
          </Link>

          <Link
            href="/materiais"
            className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl bg-card border border-borda hover:border-azul-texto text-texto-principal font-semibold transition-all text-xs sm:text-sm text-center active:scale-95 whitespace-nowrap"
          >
            Todos os Materiais 📂
          </Link>

          <button
            onClick={() => setModalAberto(true)}
            className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl bg-card border border-borda hover:border-azul-texto text-azul-texto font-semibold transition-all text-xs sm:text-sm text-center active:scale-95 whitespace-nowrap"
          >
            Contribuir 📥
          </button>
        </div>
      </section>

      {/* Modal de Contribuição */}
      <ModalContribuir isOpen={modalAberto} onClose={() => setModalAberto(false)} />
    </>
  );
}