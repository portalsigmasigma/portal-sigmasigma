'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
}

interface Professor {
  id: string;
  nome: string;
  materia?: string;
}

export default function PaginaProfessores() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Campos do formulário
  const [nomeProfessor, setNomeProfessor] = useState('');
  const [materiaSelecionada, setMateriaSelecionada] = useState('');
  const [materiaOutra, setMateriaOutra] = useState('');

  async function carregarDados() {
    setCarregando(true);

    const [resProf, resDisc] = await Promise.all([
      supabase.from('professores').select('*').order('nome', { ascending: true }),
      supabase.from('disciplinas').select('id, nome, codigo').order('nome', { ascending: true }),
    ]);

    if (!resProf.error && resProf.data) {
      setProfessores(resProf.data);
    }

    if (!resDisc.error && resDisc.data) {
      setDisciplinas(resDisc.data);
    }

    setCarregando(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function handleSalvarProfessor(e: React.FormEvent) {
    e.preventDefault();
    if (!nomeProfessor.trim()) return;

    setEnviando(true);

    // Define a matéria: pega a selecionada no select ou a digitada no campo manual
    const materiaFinal =
      materiaSelecionada === 'Outra' || !materiaSelecionada
        ? materiaOutra.trim()
        : materiaSelecionada;

    const novoProfessor = {
      nome: nomeProfessor.trim(),
      materia: materiaFinal || null,
    };

    const { error } = await supabase.from('professores').insert([novoProfessor]);

    if (!error) {
      setNomeProfessor('');
      setMateriaSelecionada('');
      setMateriaOutra('');
      setModalAberto(false);
      carregarDados();
    } else {
      alert('Erro ao cadastrar professor: ' + error.message);
    }

    setEnviando(false);
  }

  async function handleDeletarProfessor(id: string) {
    if (!confirm('Deseja remover este professor?')) return;

    const { error } = await supabase.from('professores').delete().eq('id', id);

    if (!error) {
      carregarDados();
    } else {
      alert('Erro ao remover professor: ' + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 w-full max-w-full overflow-x-hidden box-border">
      <div className="max-w-5xl mx-auto w-full">
        {/* Topo / Voltar e Ação */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-borda text-xs font-semibold text-azul-texto hover:border-azul-texto transition-all active:scale-95"
          >
            &larr; Voltar ao Início
          </Link>

          <button
            onClick={() => setModalAberto(true)}
            className="px-3.5 py-1.5 bg-destaque hover:bg-destaque/90 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span> Novo Professor
          </button>
        </div>

        {/* Cabeçalho */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-azul-texto tracking-tight">
            Professores
          </h1>
          <p className="text-xs sm:text-sm text-texto-secundario">
            Gestão de docentes e associação com disciplinas.
          </p>
        </div>

        {/* Lista de Professores */}
        {carregando ? (
          <div className="text-center py-12 text-xs text-texto-secundario animate-pulse">
            Carregando professores... ⚡
          </div>
        ) : professores.length > 0 ? (
          <div className="bg-card border border-borda rounded-xl overflow-hidden shadow-sm divide-y divide-borda">
            {professores.map((prof) => (
              <div
                key={prof.id}
                className="p-4 flex items-center justify-between hover:bg-borda/20 transition-all"
              >
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-texto-principal">
                    {prof.nome}
                  </h3>
                  <p className="text-[11px] text-texto-secundario">
                    {prof.materia ? `Disciplina: ${prof.materia}` : 'Nenhuma matéria associada'}
                  </p>
                </div>

                <button
                  onClick={() => handleDeletarProfessor(prof.id)}
                  className="p-1.5 hover:bg-red-500/20 text-texto-secundario hover:text-red-400 rounded-lg transition-all text-xs"
                  title="Excluir Professor"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-borda rounded-xl p-8 text-center text-xs text-texto-secundario">
            Nenhum professor cadastrado. Clique em "+ Novo Professor" para adicionar.
          </div>
        )}
      </div>

      {/* MODAL: Novo Professor */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-borda w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm sm:text-base font-bold text-azul-texto">
                Cadastrar Professor
              </h2>
              <button
                onClick={() => setModalAberto(false)}
                className="text-texto-secundario hover:text-texto-principal text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarProfessor} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                  Nome do Professor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Carlos Silva"
                  value={nomeProfessor}
                  onChange={(e) => setNomeProfessor(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto"
                />
              </div>

              {/* Seleção de Disciplina Existente */}
              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                  Relacionar a uma Matéria Cadastrada
                </label>
                <select
                  value={materiaSelecionada}
                  onChange={(e) => setMateriaSelecionada(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto"
                >
                  <option value="">Selecione uma matéria existente...</option>
                  {disciplinas.map((d) => (
                    <option key={d.id} value={d.nome}>
                      {d.codigo} - {d.nome}
                    </option>
                  ))}
                  <option value="Outra">+ Digitar outra matéria...</option>
                </select>
              </div>

              {/* Campo Expandido de Texto caso não escolha no Select */}
              {(materiaSelecionada === 'Outra' || materiaSelecionada === '') && (
                <div>
                  <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                    Nome / Detalhes da Matéria (Caixa Expandida)
                  </label>

                  <textarea
                    rows={3}
                    placeholder="Digite o nome da matéria ou observações sobre as disciplinas lecionadas..."
                    value={materiaOutra}
                    onChange={(e) => setMateriaOutra(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto resize-y"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="w-1/2 py-2 bg-fundo border border-borda rounded-lg text-xs font-semibold text-texto-secundario hover:text-texto-principal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-1/2 py-2 bg-destaque hover:bg-destaque/90 text-white rounded-lg text-xs font-semibold transition-all"
                >
                  {enviando ? 'Salvando...' : 'Salvar Professor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}