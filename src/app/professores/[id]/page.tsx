'use client';

import { use, useState } from 'react';
import Link from 'next/link';

interface Material {
  id: string;
  titulo: string;
  tipo: 'Prova' | 'Gabarito' | 'Lista' | 'Livro';
  disciplinaNome: string;
  anoSemestre: string;
  linkDownload: string;
}

interface ProfessorInfo {
  nome: string;
  departamento: string;
  icone: string;
  materiais: Material[];
}

const dadosProfessores: Record<string, ProfessorInfo> = {
  'roberto': {
    nome: 'Dr. Roberto',
    departamento: 'Matemática / Física',
    icone: '👨‍🏫',
    materiais: [
      {
        id: 'c1',
        titulo: 'Prova 1 - Vetores e Equações Paramétricas',
        tipo: 'Prova',
        disciplinaNome: 'Cálculo',
        anoSemestre: '2025/2',
        linkDownload: '#',
      },
      {
        id: 'c2',
        titulo: 'Gabarito P1 - Questões Resolvidas de Paramétricas',
        tipo: 'Gabarito',
        disciplinaNome: 'Cálculo',
        anoSemestre: '2025/2',
        linkDownload: '#',
      },
    ],
  },
  'ana-maria': {
    nome: 'Dra. Ana Maria',
    departamento: 'Engenharia Eletrotécnica',
    icone: '👩‍🏫',
    materiais: [
      {
        id: 'sd1',
        titulo: 'Prova 2 - Álgebra Booleana e Circuitos Combinacionais',
        tipo: 'Prova',
        disciplinaNome: 'Sistemas Digitais',
        anoSemestre: '2026/1',
        linkDownload: '#',
      },
      {
        id: 'sd2',
        titulo: 'Gabarito P2 - Resolução com Diagramas de Portas Lógicas',
        tipo: 'Gabarito',
        disciplinaNome: 'Sistemas Digitais',
        anoSemestre: '2026/1',
        linkDownload: '#',
      },
    ],
  },
  'carlos': {
    nome: 'Prof. Carlos',
    departamento: 'Circuitos e Energia',
    icone: '👨‍🔬',
    materiais: [
      {
        id: 'ce1',
        titulo: 'Lista de Exercícios - Análise Nodal e Equações de Kirchhoff',
        tipo: 'Lista',
        disciplinaNome: 'Circuitos Elétricos',
        anoSemestre: '2025/1',
        linkDownload: '#',
      },
    ],
  },
};

export default function PaginaDetalheProfessor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const idProfessor = resolvedParams.id;
  const professor = dadosProfessores[idProfessor];
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');

  if (!professor) {
    return (
      <div className="min-h-screen bg-fundo text-texto-principal flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-azul-texto mb-2">Professor não encontrado 🔍</h1>
        <p className="text-xs text-texto-secundario mb-6">Nenhum registro encontrado para este docente.</p>
        <Link href="/professores" className="px-4 py-2 bg-destaque text-white rounded-xl text-xs font-semibold">
          &larr; Voltar para a lista de professores
        </Link>
      </div>
    );
  }

  const materiaisFiltrados = filtroTipo === 'Todos'
    ? professor.materiais
    : professor.materiais.filter(m => m.tipo === filtroTipo);

  return (
    <div className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 w-full max-w-full overflow-x-hidden box-border">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Botão Voltar */}
        <Link 
          href="/professores" 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-borda text-xs font-semibold text-azul-texto hover:border-azul-texto transition-all mb-6 active:scale-95"
        >
          &larr; Voltar para Professores
        </Link>

        {/* Cabeçalho do Professor */}
        <div className="bg-card border border-borda rounded-2xl p-5 sm:p-6 mb-6 shadow-md flex items-center space-x-4">
          <span className="text-4xl p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl glow-sigma">
            {professor.icone}
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-texto-principal tracking-tight">
              {professor.nome}
            </h1>
            <p className="text-xs text-texto-secundario">
              {professor.departamento}
            </p>
          </div>
        </div>

        {/* Filtro por Categoria */}
        <div className="w-full overflow-x-auto pb-3 mb-6 scrollbar-none">
          <div className="flex items-center space-x-2 min-w-max">
            {['Todos', 'Prova', 'Gabarito', 'Lista'].map((tipo) => (
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

        {/* Lista de Materiais do Professor */}
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
                      {item.disciplinaNome} • {item.anoSemestre}
                    </span>
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-texto-principal">
                    {item.titulo}
                  </h2>
                </div>

                <a
                href={item.linkDownload}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 bg-borda/60 hover:bg-destaque hover:text-white text-xs font-semibold rounded-lg text-center transition-all inline-flex items-center justify-center gap-1.5"
                >
                Abrir Material ↗
                </a>
              </div>
            ))
          ) : (
            <div className="bg-card border border-borda rounded-xl p-8 text-center text-xs text-texto-secundario">
              Nenhum material encontrado.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}