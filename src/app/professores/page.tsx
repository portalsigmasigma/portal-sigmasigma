import Link from 'next/link';

interface Professor {
  id: string;
  nome: string;
  departamento: string;
  disciplinas: string[];
  icone: string;
}

const listaProfessores: Professor[] = [
  {
    id: 'roberto',
    nome: 'Dr. Roberto',
    departamento: 'Matemática / Física',
    disciplinas: ['Cálculo', 'Geometria Analítica'],
    icone: '👨‍🏫',
  },
  {
    id: 'ana-maria',
    nome: 'Dra. Ana Maria',
    departamento: 'Engenharia Eletrotécnica',
    disciplinas: ['Sistemas Digitais', 'Lógica Reconfigurável'],
    icone: '👩‍🏫',
  },
  {
    id: 'carlos',
    nome: 'Prof. Carlos',
    departamento: 'Circuitos e Energia',
    disciplinas: ['Circuitos Elétricos', 'Eletromagnetismo'],
    icone: '👨‍🔬',
  },
];

export default function PaginaProfessores() {
  return (
    <div className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 w-full max-w-full overflow-x-hidden box-border">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Botão de Voltar */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-borda text-xs font-semibold text-azul-texto hover:border-azul-texto transition-all mb-6 active:scale-95"
        >
          &larr; Voltar ao Início
        </Link>

        {/* Cabeçalho */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-azul-texto">
            <span>👨‍🏫 Corpo Docente</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-azul-texto tracking-tight">
            Professores
          </h1>
          <p className="text-xs sm:text-sm text-texto-secundario max-w-2xl">
            Selecione um professor para ver o histórico de provas, gabaritos e materiais associados.
          </p>
        </div>

        {/* Grade de Professores (1 coluna no celular) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {listaProfessores.map((prof) => (
            <Link
              key={prof.id}
              href={`/professores/${prof.id}`}
              className="group bg-card border border-borda hover:border-azul-texto/50 rounded-2xl p-5 transition-all duration-200 active:scale-[0.98] flex flex-col justify-between shadow-md w-full box-border"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-2xl group-hover:glow-sigma transition-all">
                    {prof.icone}
                  </span>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-borda/50 text-texto-secundario">
                    {prof.departamento}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-texto-principal group-hover:text-azul-texto transition-colors mb-1">
                  {prof.nome}
                </h2>
                <div className="flex flex-wrap gap-1 mt-2">
                  {prof.disciplinas.map((disc, idx) => (
                    <span key={idx} className="text-[10px] bg-blue-500/10 text-azul-texto px-2 py-0.5 rounded border border-blue-500/20">
                      {disc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-borda/50 flex items-center justify-between text-xs font-medium text-azul-texto">
                <span>Ver Arquivos</span>
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}