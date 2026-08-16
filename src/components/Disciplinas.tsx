// Componente de Cards de Disciplinas estruturado
import Link from 'next/link';

// Interface com a estrutura de dados para cada disciplina
interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  descricao: string;
  icone: string;
  tag: string;
}

// Lista inicial de disciplinas do curso
const listaDisciplinas: Disciplina[] = [
  {
    id: 'calculo',
    nome: 'Cálculo',
    codigo: 'MAT-01',
    descricao: 'Limites, derivadas, integrais e equações diferenciais para engenharia.',
    icone: '∫x',
    tag: 'Fundamental',
  },
  {
    id: 'sistemas-digitais',
    nome: 'Sistemas Digitais',
    codigo: 'ELT-02',
    descricao: 'Álgebra Booleana, portas lógicas, circuitos combinacionais e sequenciais.',
    icone: '101',
    tag: 'Hardware',
  },
  {
    id: 'circuitos-eletricos',
    nome: 'Circuitos Elétricos',
    codigo: 'ELT-03',
    descricao: 'Leis de Kirchhoff, análise nodal/mesh, fasores e potência em CA.',
    icone: '⚡',
    tag: 'Núcleo',
  },
  {
    id: 'eletromagnetismo',
    nome: 'Eletromagnetismo',
    codigo: 'FIS-04',
    descricao: 'Campos elétricos e magnéticos, equações de Maxwell e ondas.',
    icone: '🧲',
    tag: 'Teórica',
  },
  {
    id: 'programacao',
    nome: 'Programação / Algoritmos',
    codigo: 'COM-05',
    descricao: 'Lógica de programação, estruturas de dados e métodos numéricos em C/Python.',
    icone: '</>',
    tag: 'Software',
  },
  {
    id: 'sinais-sistemas',
    nome: 'Sinais e Sistemas',
    codigo: 'ELT-06',
    descricao: 'Sinais contínuos/discretos, transformadas de Fourier, Laplace e Z.',
    icone: '∿',
    tag: 'Avançado',
  },
];

export default function Disciplinas() {
  return (
    // Container principal focado em Mobile First
    <section id="disciplinas" className="w-full py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col items-start mb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-azul-texto">
          <span>📚 Grade Acadêmica</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-azul-texto tracking-tight">
          Disciplinas & Recursos
        </h2>
        <p className="text-sm text-texto-secundario max-w-2xl">
          Selecione uma matéria para acessar materiais, listas salvas e arquivos.
        </p>
      </div>

      {/* Grade de Cards Responsiva (1 coluna no mobile, expande em telas maiores) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listaDisciplinas.map((item) => (
          <Link
            key={item.id}
            href={`/disciplinas/${item.id}`}
            className="group bg-card border border-borda hover:border-azul-texto/50 rounded-2xl p-5 transition-all duration-200 active:scale-[0.98] flex flex-col justify-between shadow-md"
          >
            <div>
              {/* Ícone e Código da matéria */}
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-azul-texto text-sm group-hover:glow-sigma transition-all">
                  {item.icone}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-borda/50 text-texto-secundario">
                  {item.codigo}
                </span>
              </div>

              {/* Título e Descrição */}
              <h3 className="text-lg font-bold text-texto-principal group-hover:text-azul-texto transition-colors mb-1">
                {item.nome}
              </h3>
              <p className="text-xs sm:text-sm text-texto-secundario leading-relaxed">
                {item.descricao}
              </p>
            </div>

            {/* Ação no Rodapé do Card */}
            <div className="mt-5 pt-3 border-t border-borda/50 flex items-center justify-between text-xs font-medium text-azul-texto">
              <span>{item.tag}</span>
              <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Acessar &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}