'use client';

import { use, useState } from 'react';
import Link from 'next/link';

interface Material {
  id: string;
  titulo: string;
  tipo: 'Prova' | 'Gabarito' | 'Lista' | 'Livro';
  professor: string;
  anoSemestre: string;
  linkDownload: string;
}

interface DisciplinaInfo {
  nome: string;
  codigo: string;
  descricao: string;
  icone: string;
  materiais: Material[];
}

// Banco de dados simulado organizado por ID da disciplina
const dadosDisciplinas: Record<string, DisciplinaInfo> = {
  'calculo': {
    nome: 'Cálculo',
    codigo: 'MAT-01',
    descricao: 'Limites, derivadas, integrais, equações diferenciais e curvas paramétricas.',
    icone: '∫x',
    materiais: [
      {
        id: 'c1',
        titulo: 'Prova 1 - Vetores e Equações Paramétricas',
        tipo: 'Prova',
        professor: 'Dr. Roberto',
        anoSemestre: '2025/2',
        linkDownload: '#',
      },
      {
        id: 'c2',
        titulo: 'Gabarito P1 - Questões Resolvidas de Paramétricas',
        tipo: 'Gabarito',
        professor: 'Dr. Roberto',
        anoSemestre: '2025/2',
        linkDownload: '#',
      },
      {
        id: 'c3',
        titulo: 'Livro Cálculo George B. Thomas v2 12ª edição (PDF)',
        tipo: 'Livro',
        professor: 'Geral',
        anoSemestre: 'Geral',
        linkDownload: '#',
      },
    ],
  },
  'sistemas-digitais': {
    nome: 'Sistemas Digitais',
    codigo: 'ELT-02',
    descricao: 'Álgebra Booleana, minimização de mapas de Karnaugh, portas lógicas e circuitos sequenciais.',
    icone: '101',
    materiais: [
      {
        id: 'sd1',
        titulo: 'Prova 2 - Álgebra Booleana e Circuitos Combinacionais',
        tipo: 'Prova',
        professor: 'Dra. Ana Maria',
        anoSemestre: '2026/1',
        linkDownload: '#',
      },
      {
        id: 'sd2',
        titulo: 'Gabarito P2 - Resolução com Diagramas de Portas Lógicas',
        tipo: 'Gabarito',
        professor: 'Dra. Ana Maria',
        anoSemestre: '2026/1',
        linkDownload: '#',
      },
      {
        id: 'sd3',
        titulo: 'Lista de Exercícios 5 - Simplificação Booleana',
        tipo: 'Lista',
        professor: 'Dra. Ana Maria',
        anoSemestre: '2026/1',
        linkDownload: '#',
      },
    ],
  },
  'circuitos-eletricos': {
    nome: 'Circuitos Elétricos',
    codigo: 'ELT-03',
    descricao: 'Leis de Kirchhoff, análise nodal e de malhas, fasores e circuitos de corrente alternada.',
    icone: '⚡',
    materiais: [
      {
        id: 'ce1',
        titulo: 'Lista de Exercícios - Análise Nodal e Equações de Kirchhoff',
        tipo: 'Lista',
        professor: 'Prof. Carlos',
        anoSemestre: '2025/1',
        linkDownload: '#',
      },
    ],
  },
};

export default function PaginaDetalhedisciplina({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwraps os parâmetros da URL no Next.js
  const resolvedParams = use(params);
  const idDisciplina = resolvedParams.id;

  const disciplina = dadosDisciplinas[idDisciplina];
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');

  // Trata caso o aluno digite uma URL de disciplina inexistente
  if (!disciplina) {
    return (
      <div className="min-h-screen bg-fundo text-texto-principal flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-azul-texto mb-2">Disciplina não encontrada 🔍</h1>
        <p className="text-xs text-texto-secundario mb-6">A matéria que você procurou ainda não possui acervo cadastrado.</p>
        <Link href="/disciplinas" className="px-4 py-2 bg-destaque text-white rounded-xl text-xs font-semibold">
          &larr; Voltar para a lista de disciplinas
        </Link>
      </div>
    );
  }

  const materiaisFiltrados = filtroTipo === 'Todos'
    ? disciplina.materiais
    : disciplina.materiais.filter(m => m.tipo === filtroTipo);

  return (
    <div className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 w-full max-w-full overflow-x-hidden box-border">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Botão Voltar */}
        <Link 
          href="/disciplinas" 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-borda text-xs font-semibold text-azul-texto hover:border-azul-texto transition-all mb-6 active:scale-95"
        >
          &larr; Voltar para Disciplinas
        </Link>

        {/* Cabeçalho da Disciplina */}
        <div className="bg-card border border-borda rounded-2xl p-5 sm:p-6 mb-6 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-azul-texto text-base glow-sigma">
              {disciplina.icone}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-md bg-borda/50 text-texto-secundario">
              {disciplina.codigo}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-texto-principal tracking-tight">
            {disciplina.nome}
          </h1>
          <p className="text-xs sm:text-sm text-texto-secundario leading-relaxed">
            {disciplina.descricao}
          </p>
        </div>

        {/* Filtro por Categoria */}
        <div className="w-full overflow-x-auto pb-3 mb-6 scrollbar-none">
          <div className="flex items-center space-x-2 min-w-max">
            {['Todos', 'Prova', 'Gabarito', 'Lista', 'Livro'].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filtroTipo === tipo
                    ? 'bg-destaque text-white shadow-md'
                    : 'bg-card border border-borda text-texto-secundario hover:text-texto-principal'
                }`}
              >
                {tipo}s
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Materiais da Disciplina */}
        <div className="space-y-3 w-full">
          {materiaisFiltrados.length > 0 ? (
            materiaisFiltrados.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-borda rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-azul-texto/40 transition-all w-full box-border"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-azul-texto border border-blue-500/20">
                      {item.tipo}
                    </span>
                    <span className="text-xs text-texto-secundario">
                      Prof. {item.professor} • {item.anoSemestre}
                    </span>
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-texto-principal">
                    {item.titulo}
                  </h2>
                </div>

                <a
                  href={item.linkDownload}
                  className="w-full sm:w-auto px-4 py-2 bg-borda/60 hover:bg-destaque hover:text-white text-xs font-semibold rounded-lg text-center transition-all"
                >
                  Baixar / Abrir
                </a>
              </div>
            ))
          ) : (
            <div className="bg-card border border-borda rounded-xl p-8 text-center text-xs text-texto-secundario">
              Nenhum material do tipo "{filtroTipo}" cadastrado para esta matéria ainda.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}