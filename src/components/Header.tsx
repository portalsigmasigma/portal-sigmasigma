import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-borda bg-fundo/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo + Nome do Portal */}
        <Link href="/" className="flex items-center space-x-3 group">
          <span className="text-2xl font-black tracking-tighter glow-sigma transition-transform group-hover:scale-105">
            ΣΣ
          </span>
          <span className="font-extrabold text-lg text-azul-texto hidden sm:inline">
            Portal <span className="glow-sigma">Σ</span><span className="text-azul-texto">E</span>
          </span>
        </Link>

        {/* Links de Navegação */}
        <nav className="flex items-center space-x-6 text-sm font-medium text-texto-secundario">
          <Link href="/" className="text-texto-principal hover:text-azul-texto transition-colors">
            Início
          </Link>
          <Link href="#disciplinas" className="hover:text-azul-texto transition-colors">
            Disciplinas
          </Link>
          <Link href="#materiais" className="hover:text-azul-texto transition-colors">
            Materiais
          </Link>
          <Link href="#ferramentas" className="hover:text-azul-texto transition-colors">
            Ferramentas
          </Link>
        </nav>

        {/* Status / Ação Rápida */}
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-azul-texto border border-blue-500/20">
            Graduação
          </span>
        </div>

      </div>
    </header>
  );
}