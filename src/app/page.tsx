// Página inicial com a logo ΣΣ neon acima do título
export default function Home() {
  return (
    // Container principal centralizado com fundo azul-marinho (#070A13)
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-fundo">
      
      {/* Container de conteúdo com espaçamento vertical */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl">
        
        {/* Logo ΣΣ em destaque com o efeito de brilho neon azul/ciano */}
        <div className="text-7xl sm:text-8xl font-black tracking-tighter glow-sigma">
          ΣΣ
        </div>

        {/* Título principal em tom azul com os sigmas brilhantes */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-azul-texto">
          Portal de <span className="glow-sigma">Σ</span>ngenharia <span className="glow-sigma">Σ</span>létrica
        </h1>
        
        {/* Subtítulo descritivo */}
        <p className="text-base sm:text-lg text-texto-secundario max-w-xl">
          Plataforma tecnológica para organizar e facilitar o acesso a informações, materiais e recursos acadêmicos.
        </p>

        {/* Card em tom azul-escuro indicando a fase atual */}
        <div className="px-6 py-4 bg-card border border-borda rounded-xl shadow-lg mt-4">
          <p className="text-sm font-medium text-texto-principal">
            Fase 3 — Identidade Visual
          </p>
          <p className="text-xs text-texto-secundario mt-1">
            Logo <span className="glow-sigma font-bold">ΣΣ</span> brilhante aplicada com sucesso.
          </p>
        </div>

      </div>

    </main>
  );
}