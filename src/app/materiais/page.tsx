'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface Material {
  id: string;
  titulo: string;
  tipo: 'Prova' | 'Gabarito' | 'Lista' | 'Livro';
  disciplinaId: string;
  disciplinaNome: string;
  professor: string;
  anoSemestre: string;
  linkDownload: string;
}

export const bancoMateriais: Material[] = [
  {
    id: 'mat-1',
    titulo: 'Prova 1 - Cálculo 2 (Paramétricas e Vetores)',
    tipo: 'Prova',
    disciplinaId: 'calculo',
    disciplinaNome: 'Cálculo',
    professor: 'Dr. Roberto',
    anoSemestre: '2025/2',
    linkDownload: '#',
  },
  {
    id: 'mat-2',
    titulo: 'Gabarito Oficial P1 - Sistemas Digitais (Questão 5 Booleana)',
    tipo: 'Gabarito',
    disciplinaId: 'sistemas-digitais',
    disciplinaNome: 'Sistemas Digitais',
    professor: 'Dra. Ana Maria',
    anoSemestre: '2026/1',
    linkDownload: '#',
  },
  {
    id: 'mat-3',
    titulo: 'Lista de Exercícios 3 - Leis de Kirchhoff e Nodal',
    tipo: 'Lista',
    disciplinaId: 'circuitos-eletricos',
    disciplinaNome: 'Circuitos Elétricos',
    professor: 'Prof. Carlos',
    anoSemestre: '2025/1',
    linkDownload: '#',
  },
  {
    id: 'mat-4',
    titulo: 'Cálculo - Thomas Vol. 2 (12ª Edição) PDF',
    tipo: 'Livro',
    disciplinaId: 'calculo',
    disciplinaNome: 'Cálculo',
    professor: 'Geral',
    anoSemestre: 'Geral',
    linkDownload: '#',
  },
];

export default function PaginaMateriais() {
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');

  const materiaisFiltrados = filtroTipo === 'Todos'
    ? bancoMateriais
    : bancoMateriais.filter(m => m.tipo === filtroTipo);

  return (
    <div className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 w-full max-w-full overflow-x-hidden box-border">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Botão Voltar */}
        <Link href="/" className="inline-flex items-center text-xs font-semibold text-azul-texto hover:underline mb-6">
          &larr; Voltar para a Página Inicial
        </Link>

        {/* Cabeçalho */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-azul-texto tracking-tight">
            Acervo Geral de Materiais 📂
          </h1>
          <p className="text-xs sm:text-sm text-texto-secundario">
            Todos os arquivos, provas e listas do curso agrupados em um só lugar.
          </p>
        </div>

        {/* Filtro com rolagem interna protegida (não estica a viewport) */}
        <div className="w-full overflow-x-auto pb-3 mb-6 scrollbar-none">
          <div className="flex items-center space-x-2 min-w-max">
            {['Todos', 'Prova', 'Gabarito', 'Lista', 'Livro'].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filtroTipo === tipo
                    ? 'bg-destaque text-white'
                    : 'bg-card border border-borda text-texto-secundario hover:text-texto-principal'
                }`}
              >
                {tipo}s
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Materiais adaptada ao mobile */}
        <div className="space-y-3 w-full">
          {materiaisFiltrados.map((item) => (
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
                    {item.disciplinaNome} • {item.professor}
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
          ))}
        </div>

      </div>
    </div>
  );
}