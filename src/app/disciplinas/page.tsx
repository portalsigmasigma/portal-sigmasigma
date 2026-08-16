import Link from 'next/link';

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  descricao: string;
  icone: string;
  tag: string;
}

const listaDisciplinas: Disciplina[] = [
  {
    id: 'calculo',
    nome: 'Cálculo',
    codigo: 'MAT-01',
    descricao: 'Limites, derivadas, integrais e equações diferenciais.',
    icone: '∫x',
    tag: 'Fundamental',
  },
  {
    id: 'sistemas-digitais',
    nome: 'Sistemas Digitais',
    codigo: 'ELT-02',
    descricao: 'Álgebra Booleana, portas lógicas e circuitos digitais.',
    icone: '101',
    tag: 'Hardware',
  },
  {
    id: 'circuitos-eletricos',
    nome: 'Circuitos Elétricos',
    codigo: 'ELT-03',
    descricao: 'Leis de Kirchhoff, análise nodal e fasores.',
    icone: '⚡',
    tag: 'Núcleo',
  },
  {
    id: 'eletromagnetismo',
    nome: 'Eletromagnetismo',
    codigo: 'FIS-04',
    descricao: 'Campos elétricos, magnéticos e equações de Maxwell.',
    icone: '🧲',
    tag: 'Teórica',
  },
  {
    id: 'programacao',
    nome: 'Programação / Algoritmos',
    codigo: 'COM-05',
    descricao: 'Lógica, estruturas de dados e métodos numéricos.',
    icone: '</>',
    tag: 'Software',
  },
  {
    id: 'sinais-sistemas',
    nome: 'Sinais e Sistemas',
    codigo: 'ELT-06',
    descricao: 'Sinais contínuos/discretos, Fourier, Laplace e Z.',
    icone: '∿',
    tag: 'Avançado',
  },
];

export default function PaginaDisciplinas() {
  return (
    /* Contenção estrita de largura para evitar scroll lateral no mobile */
    <div className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 w-full max-w-full overflow-x-hidden box-border">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Botão de Voltar para a Home */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-borda text-xs font-semibold text-azul-texto hover:border-azul-texto transition-all mb-6 active:scale-95"
        >
          &larr; Voltar ao Início
        </Link>

        {/* Cabeçalho */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-azul-texto">
            <span>📚 Grade do Curso</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-azul-texto tracking-tight">
            Disciplinas
          </h1>
          <p className="text-xs sm:text-sm text-texto-secundario max-w-2xl">
            Selecione uma matéria para ver o acervo de materiais e provas associados.
          </p>
        </div>

        {/* Grade em 1 coluna estrita no celular (grid-cols-1 w-full) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {listaDisciplinas.map((item) => (
            <Link
              key={item.id}
              href={`/disciplinas/${item.id}`}
              className="group bg-card border border-borda hover:border-azul-texto/50 rounded-2xl p-5 transition-all duration-200 active:scale-[0.98] flex flex-col justify-between shadow-md w-full box-border"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-azul-texto text-sm group-hover:glow-sigma transition-all">
                    {item.icone}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-borda/50 text-texto-secundario">
                    {item.codigo}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-texto-principal group-hover:text-azul-texto transition-colors mb-1">
                  {item.nome}
                </h2>
                <p className="text-xs text-texto-secundario leading-relaxed">
                  {item.descricao}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-borda/50 flex items-center justify-between text-xs font-medium text-azul-texto">
                <span>{item.tag}</span>
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Ver Materiais &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}