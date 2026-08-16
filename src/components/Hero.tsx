import Link from 'next/link';

export default function Hero() {
  return (
    <section className="w-full py-10 sm:py-16 md:py-20 flex flex-col items-center justify-center text-center px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-5 sm:space-y-6">
        
        {/* Badge superior */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-azul-texto">
          <span>⚡ De estudante para estudante</span>
        </div>

        {/* Logo ΣΣ */}
        <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter glow-sigma">
          ΣΣ
        </div>

        {/* Título Principal */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-azul-texto leading-tight">
          Portal de <span className="glow-sigma">Σ</span>ngenharia <span className="glow-sigma">Σ</span>létrica
        </h1>

        {/* Subtítulo */}
        <p className="text-sm sm:text-base md:text-lg text-texto-secundario max-w-2xl leading-relaxed">
          Um repositório <strong className="text-texto-principal">100% independente</strong> — feito por pura vontade de sobreviver ao curso, sem qualquer vínculo, benção ou dedo da representação do colegiado. Criado para salvar a pele e facilitar a vida dos eletricistas ceféticos! ⚡⚙️
        </p>

        {/* Botões de Ação direcionando para páginas dedicadas */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
          {/* Botão 1: Redireciona para a página dedicada de Disciplinas */}
            // Trecho do Hero.tsx
            <Link
            href="/disciplinas"
            className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl bg-destaque hover:bg-blue-600 text-white font-semibold transition-all shadow-lg shadow-cyan-500/10 text-sm text-center active:scale-95"
            >
            Explorar Disciplinas 📚
            </Link>

          {/* Botão 2: Redireciona para o acervo de Materiais */}
          <Link
            href="/materiais"
            className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl bg-card border border-borda hover:border-azul-texto text-texto-principal font-semibold transition-all text-sm text-center active:scale-95"
          >
            Todos os Materiais & Provas 📂
          </Link>
        </div>

      </div>
    </section>
  );
}