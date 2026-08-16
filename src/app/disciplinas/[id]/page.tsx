'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  tipo: 'Obrigatória' | 'Optativa';
  periodo?: string; // ex: "1º Período"
  created_at?: string;
}

interface Professor {
  id: string;
  nome: string;
}

export default function PaginaDisciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('Todas');

  // Modal para Nova Disciplina
  const [modalDisciplinaAberto, setModalDisciplinaAberto] = useState(false);
  const [enviandoDisciplina, setEnviandoDisciplina] = useState(false);

  // Campos - Nova Disciplina
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [codigoDisciplina, setCodigoDisciplina] = useState('');
  const [tipoDisciplina, setTipoDisciplina] = useState<'Obrigatória' | 'Optativa'>('Obrigatória');
  const [periodoDisciplina, setPeriodoDisciplina] = useState('1º Período');

  // Modal para Relacionar Material
  const [modalMaterialAberto, setModalMaterialAberto] = useState(false);
  const [enviandoMaterial, setEnviandoMaterial] = useState(false);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<Disciplina | null>(null);

  // Campos - Relacionar Material
  const [tituloMaterial, setTituloMaterial] = useState('');
  const [professorMaterial, setProfessorMaterial] = useState('');
  const [tipoMaterial, setTipoMaterial] = useState('Prova');
  const [linkDrive, setLinkDrive] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Buscar Disciplinas e Professores
  async function carregarDados() {
    setCarregando(true);

    const [resDisc, resProf] = await Promise.all([
      supabase.from('disciplinas').select('*').order('codigo', { ascending: true }),
      supabase.from('professores').select('id, nome').order('nome', { ascending: true }),
    ]);

    if (!resDisc.error && resDisc.data) {
      setDisciplinas(resDisc.data);
    }

    if (!resProf.error && resProf.data) {
      setProfessores(resProf.data);
    }

    setCarregando(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // Adicionar Nova Disciplina
  async function handleSalvarDisciplina(e: React.FormEvent) {
    e.preventDefault();
    if (!nomeDisciplina.trim() || !codigoDisciplina.trim()) return;

    setEnviandoDisciplina(true);

    const novaDisciplina = {
      nome: nomeDisciplina.trim(),
      codigo: codigoDisciplina.trim().toUpperCase(),
      tipo: tipoDisciplina,
      periodo: tipoDisciplina === 'Obrigatória' ? periodoDisciplina : 'Optativa',
    };

    const { error } = await supabase.from('disciplinas').insert([novaDisciplina]);

    if (!error) {
      setNomeDisciplina('');
      setCodigoDisciplina('');
      setTipoDisciplina('Obrigatória');
      setPeriodoDisciplina('1º Período');
      setModalDisciplinaAberto(false);
      carregarDados();
    } else {
      alert('Erro ao cadastrar disciplina: ' + error.message);
    }

    setEnviandoDisciplina(false);
  }

  // Abrir Modal de Relacionar Material
  function abrirModalMaterial(disc: Disciplina) {
    setDisciplinaSelecionada(disc);
    setTituloMaterial('');
    setProfessorMaterial('');
    setTipoMaterial('Prova');
    setLinkDrive('');
    setObservacoes('');
    setModalMaterialAberto(true);
  }

  // Salvar Material Relacionado
  async function handleSalvarMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!disciplinaSelecionada || !tituloMaterial.trim() || !linkDrive.trim()) return;

    setEnviandoMaterial(true);

    const novoMaterial = {
      titulo: tituloMaterial.trim(),
      disciplina: disciplinaSelecionada.nome,
      professor: professorMaterial || null,
      tipo: tipoMaterial,
      link_drive: linkDrive.trim(),
      observacoes: observacoes.trim() || null,
      status: 'aprovado', // ou 'pendente', caso use aprovação
    };

    // Tenta salvar na tabela 'materiais' (ou 'contribuicoes' como fallback)
    let { error } = await supabase.from('materiais').insert([novoMaterial]);

    if (error) {
      const fallback = await supabase.from('contribuicoes').insert([novoMaterial]);
      error = fallback.error;
    }

    if (!error) {
      alert('Material vinculado com sucesso!');
      setModalMaterialAberto(false);
    } else {
      alert('Erro ao salvar material: ' + error.message);
    }

    setEnviandoMaterial(false);
  }

  // Filtragem
  const disciplinasFiltradas = disciplinas.filter((d) => {
    if (filtroTipo === 'Todas') return true;
    return d.tipo === filtroTipo;
  });

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
            onClick={() => setModalDisciplinaAberto(true)}
            className="px-3.5 py-1.5 bg-destaque hover:bg-destaque/90 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span> Nova Disciplina
          </button>
        </div>

        {/* Cabeçalho */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-azul-texto tracking-tight">
            Grade de Disciplinas
          </h1>
          <p className="text-xs sm:text-sm text-texto-secundario">
            Lista organizada de matérias com opção de adicionar materiais direto em cada uma.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center space-x-2 mb-6">
          {['Todas', 'Obrigatória', 'Optativa'].map((t) => (
            <button
              key={t}
              onClick={() => setFiltroTipo(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filtroTipo === t
                  ? 'bg-destaque text-white shadow-md'
                  : 'bg-card border border-borda text-texto-secundario hover:text-texto-principal'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Lista Compacta de Disciplinas */}
        {carregando ? (
          <div className="text-center py-12 text-xs text-texto-secundario animate-pulse">
            Carregando disciplinas... ⚡
          </div>
        ) : disciplinasFiltradas.length > 0 ? (
          <div className="bg-card border border-borda rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-borda">
              {disciplinasFiltradas.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-borda/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {/* Código da Matéria */}
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-borda/40 text-azul-texto shrink-0">
                      {item.codigo}
                    </span>

                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-texto-principal">
                        {item.nome}
                      </h3>
                      <p className="text-[11px] text-texto-secundario">
                        {item.tipo === 'Obrigatória'
                          ? `Obrigatória • ${item.periodo || 'Período não informado'}`
                          : 'Matéria Optativa'}
                      </p>
                    </div>
                  </div>

                  {/* Ações e Tags */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                        item.tipo === 'Obrigatória'
                          ? 'bg-blue-500/10 text-azul-texto border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}
                    >
                      {item.tipo}
                    </span>

                    {/* Botão Relacionar Material */}
                    <button
                      onClick={() => abrirModalMaterial(item)}
                      className="px-2.5 py-1 bg-borda/50 hover:bg-destaque hover:text-white text-[11px] font-semibold rounded-lg transition-all text-texto-principal flex items-center gap-1 cursor-pointer"
                    >
                      <span>📎</span> Relacionar Material
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-borda rounded-xl p-8 text-center text-xs text-texto-secundario">
            Nenhuma disciplina encontrada para o filtro selecionado.
          </div>
        )}
      </div>

      {/* MODAL 1: Cadastro de Nova Disciplina */}
      {modalDisciplinaAberto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-borda w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm sm:text-base font-bold text-azul-texto">
                Cadastrar Nova Disciplina
              </h2>
              <button
                onClick={() => setModalDisciplinaAberto(false)}
                className="text-texto-secundario hover:text-texto-principal text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarDisciplina} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                  Nome da Disciplina
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sistemas Digitais"
                  value={nomeDisciplina}
                  onChange={(e) => setNomeDisciplina(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                  Código da Disciplina
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ELC102"
                  value={codigoDisciplina}
                  onChange={(e) => setCodigoDisciplina(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                  Tipo da Disciplina
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoDisciplina('Obrigatória')}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                      tipoDisciplina === 'Obrigatória'
                        ? 'bg-destaque text-white border-destaque'
                        : 'bg-fundo border-borda text-texto-secundario'
                    }`}
                  >
                    Obrigatória
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoDisciplina('Optativa')}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                      tipoDisciplina === 'Optativa'
                        ? 'bg-destaque text-white border-destaque'
                        : 'bg-fundo border-borda text-texto-secundario'
                    }`}
                  >
                    Optativa
                  </button>
                </div>
              </div>

              {tipoDisciplina === 'Obrigatória' && (
                <div>
                  <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                    Qual Período?
                  </label>
                  <select
                    value={periodoDisciplina}
                    onChange={(e) => setPeriodoDisciplina(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                      <option key={p} value={`${p}º Período`}>
                        {p}º Período
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalDisciplinaAberto(false)}
                  className="w-1/2 py-2 bg-fundo border border-borda rounded-lg text-xs font-semibold text-texto-secundario hover:text-texto-principal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviandoDisciplina}
                  className="w-1/2 py-2 bg-destaque hover:bg-destaque/90 text-white rounded-lg text-xs font-semibold transition-all"
                >
                  {enviandoDisciplina ? 'Salvando...' : 'Salvar Disciplina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Relacionar Material à Disciplina */}
      {modalMaterialAberto && disciplinaSelecionada && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-borda w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-azul-texto">
                  Adicionar Material
                </h2>
                <p className="text-[11px] text-texto-secundario">
                  Para: <strong className="text-texto-principal">{disciplinaSelecionada.nome}</strong> ({disciplinaSelecionada.codigo})
                </p>
              </div>
              <button
                onClick={() => setModalMaterialAberto(false)}
                className="text-texto-secundario hover:text-texto-principal text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarMaterial} className="space-y-3">
              {/* Título do Arquivo */}
              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                  Título do Arquivo / Prova
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prova 1 - 2023.2"
                  value={tituloMaterial}
                  onChange={(e) => setTituloMaterial(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto"
                />
              </div>

              {/* Professor Responsável (Opcional) */}
              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                  Professor (Opcional)
                </label>
                {professores.length > 0 ? (
                  <select
                    value={professorMaterial}
                    onChange={(e) => setProfessorMaterial(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto"
                  >
                    <option value="">Selecione o professor (se souber)...</option>
                    {professores.map((prof) => (
                      <option key={prof.id} value={prof.nome}>
                        {prof.nome}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Nome do professor..."
                    value={professorMaterial}
                    onChange={(e) => setProfessorMaterial(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto"
                  />
                )}
              </div>

              {/* Tipo de Material */}
              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                  Tipo de Material
                </label>
                <select
                  value={tipoMaterial}
                  onChange={(e) => setTipoMaterial(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto"
                >
                  <option value="Prova">Prova</option>
                  <option value="Lista de Exercícios">Lista de Exercícios</option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Gabarito">Gabarito</option>
                  <option value="Material Didático">Material Didático</option>
                </select>
              </div>

              {/* Link do Google Drive */}
              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                  Link do Google Drive
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  value={linkDrive}
                  onChange={(e) => setLinkDrive(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto"
                />
              </div>

              {/* Observações */}
              <div>
                <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                  Observações (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Contém gabarito no final"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-fundo border border-borda text-texto-principal focus:outline-none focus:border-azul-texto"
                />
              </div>

              {/* Botões do Modal */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMaterialAberto(false)}
                  className="w-1/2 py-2 bg-fundo border border-borda rounded-lg text-xs font-semibold text-texto-secundario hover:text-texto-principal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviandoMaterial}
                  className="w-1/2 py-2 bg-destaque hover:bg-destaque/90 text-white rounded-lg text-xs font-semibold transition-all"
                >
                  {enviandoMaterial ? 'Enviando...' : 'Salvar Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}