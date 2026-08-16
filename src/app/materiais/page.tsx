'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Material {
  id: string;
  titulo: string;
  disciplina: string;
  professor?: string;
  tipo: string;
  link_drive: string;
  observacoes?: string;
  descricao?: string;
  created_at: string;
}

export default function PaginaMateriais() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');

  useEffect(() => {
    async function buscarMateriais() {
      setCarregando(true);
      // Busca materiais aprovados da tabela 'materiais' ou 'contribuicoes'
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .eq('status', 'aprovado')
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback caso sua tabela no banco se chame 'contribuicoes'
        const { data: dataContrib } = await supabase
          .from('contribuicoes')
          .select('*')
          .eq('status', 'aprovado')
          .order('created_at', { ascending: false });

        setMateriais(dataContrib || []);
      } else {
        setMateriais(data || []);
      }
      setCarregando(false);
    }

    buscarMateriais();
  }, []);

  const materiaisFiltrados =
    filtroTipo === 'Todos'
      ? materiais
      : materiais.filter((m) => m.tipo === filtroTipo);

  return (
    <div className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 w-full max-w-full overflow-x-hidden box-border">
      <div className="max-w-5xl mx-auto w-full">
        {/* Botão Voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-borda text-xs font-semibold text-azul-texto hover:border-azul-texto transition-all mb-6 active:scale-95"
        >
          &larr; Voltar ao Início
        </Link>

        {/* Cabeçalho */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-azul-texto tracking-tight">
            Todos os Materiais & Provas
          </h1>
          <p className="text-xs sm:text-sm text-texto-secundario">
            Acervo atualizado em tempo real via colaboração dos alunos.
          </p>
        </div>

        {/* Filtros */}
        <div className="w-full overflow-x-auto pb-3 mb-6 scrollbar-none">
          <div className="flex items-center space-x-2 min-w-max">
            {[
              'Todos',
              'Prova',
              'Lista de Exercícios',
              'Trabalho',
              'Gabarito',
              'Material Didático',
            ].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filtroTipo === tipo
                    ? 'bg-destaque text-white shadow-md'
                    : 'bg-card border border-borda text-texto-secundario hover:text-texto-principal'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Arquivos */}
        {carregando ? (
          <div className="text-center py-12 text-xs text-texto-secundario animate-pulse">
            Carregando acervo do Supabase... ⚡
          </div>
        ) : materiaisFiltrados.length > 0 ? (
          <div className="space-y-3 w-full">
            {materiaisFiltrados.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-borda rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-azul-texto/40 transition-all w-full box-border"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Badge do Tipo de Material */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-azul-texto border border-blue-500/20">
                      {item.tipo}
                    </span>

                    {/* Nome da Disciplina */}
                    <span className="text-xs font-semibold text-texto-principal">
                      {item.disciplina}
                    </span>

                    {/* 🚀 BADGE/TAG DO PROFESSOR (se existir) */}
                    {item.professor && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        👨‍🏫 {item.professor}
                      </span>
                    )}
                  </div>

                  {/* Título do Material */}
                  <h2 className="text-xs sm:text-sm font-bold text-texto-principal">
                    {item.titulo}
                  </h2>

                  {/* Observações ou Descrição */}
                  {(item.observacoes || item.descricao) && (
                    <p className="text-[11px] text-texto-secundario italic">
                      Obs: {item.observacoes || item.descricao}
                    </p>
                  )}
                </div>

                {/* Botão de Acesso */}
                <a
                  href={item.link_drive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 bg-borda/60 hover:bg-destaque hover:text-white text-xs font-semibold rounded-lg text-center transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  Abrir Material ↗
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-borda rounded-xl p-8 text-center text-xs text-texto-secundario">
            Nenhum material aprovado encontrado para a categoria "{filtroTipo}".
          </div>
        )}
      </div>
    </div>
  );
}