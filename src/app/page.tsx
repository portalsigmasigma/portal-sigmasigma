import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-fundo flex flex-col">
      {/* Componente do Header isolado */}
      <Header />

      {/* Conteúdo temporário do centro */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl font-black tracking-tighter glow-sigma mb-4">
          ΣΣ
        </div>
        <h1 className="text-3xl font-extrabold text-azul-texto">
          Portal de <span className="glow-sigma">Σ</span>ngenharia <span className="glow-sigma">Σ</span>létrica
        </h1>
        <p className="text-texto-secundario max-w-md mt-2">
          Header integrado com sucesso.
        </p>
      </main>
    </div>
  );
}