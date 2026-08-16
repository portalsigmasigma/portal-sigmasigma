'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  professorId: string;
  professorNome: string;
}

interface MaterialExistente {
  id: string;
  titulo: string;
  disciplina: string;
  tipo: string;
  link_drive: string;
  professor?: string;
}

export default function ModalAdicionarMaterialProfessor({
  isOpen,
  onClose,
  professorId,
  professorNome,
}: ModalProps) {
  const [modo, setModo] = useState<'existente' | 'novo'>('existente');
  const [enviado, setEnviado] = useState(false);

  // Estados para busca/vínculo de existentes
  const [buscaMaterial, setBuscaMaterial] = useState('');
  const [materiaisExistentes, setMateriaisExistentes] = useState<MaterialExistente[]>([]);
  const [loadingBusca, setLoadingBusca] = useState(false);

  // Estados para formulário de NOVO material
  const [titulo, setTitulo] = useState('');
  const [disciplinasCadastradas, setDisciplinasCadastradas] = useState<string[]>([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');
  const [outraDisciplina, setOutraDisciplina] = useState('');
  const [tipo, setTipo] = useState('Material Didático');
  const [linkDrive, setLinkDrive] = useState('');
  const [descricao, setDescricao] = useState('');

  const tiposMaterial = [
    'Material Didático',
    'Prova',
    'Trabalho',
    'Lista de Exercícios',
    'Resumo',
    'Outros',
  ];

  useEffect(() => {
    if (isOpen) {
      fetchDisciplinas();
      fetchMateriaisExistentes();
    }
  }, [isOpen]);

  // Busca todos os materiais já cadastrados no banco para permitir vincular
  const fetchMateriaisExistentes = async () => {
    setLoadingBusca(true);
    const { data } = await supabase
      .from('materiais')
      .select('id, titulo, disciplina, tipo, link_drive, professor');

    if (data) {
      setMateriaisExistentes(data);
    }
    setLoadingBusca(false);
  };

  const fetchDisciplinas = async () => {
    const padrao = [
      'Cálculo I',
      'Cálculo II',
      'Sistemas Digitais',
      'Circuitos Elétricos',
      'Física Teórica',
      'Geometria Analítica',
    ];

    try {
      const { data } = await supabase.from('materiais').select('disciplina');
      if (data) {
        const doBanco = data.map((d) => d.disciplina).filter(Boolean);
        const unicas = Array.from(new Set([...padrao, ...doBanco])).sort();
        setDisciplinasCadastradas(unicas);
        if (unicas.length > 0) setDisciplinaSelecionada(unicas[0]);
      } else {
        setDisciplinasCadastradas(padrao);
        setDisciplinaSelecionada(padrao[0]);
      }
    } catch {
      setDisciplinasCadastradas(padrao);
      setDisciplinaSelecionada(padrao[0]);
    }
  };

  if (!isOpen) return null;

  // Vincular um material JÁ EXISTENTE no banco a este professor
  const handleVincularMaterial = async (mat: MaterialExistente) => {
    const { error } = await supabase
      .from('materiais')
      .update({
        professor_id: professorId,
        professor: professorNome,
      })
      .eq('id', mat.id);

    if (error) {
      console.error('Erro ao vincular material:', error);
      alert('Erro ao vincular material. Tente novamente!');
      return;
    }

    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      onClose();
    }, 2000);
  };

  // Cadastrar um NOVO material vinculado a este professor
  const handleSubmitNovo = async (e: React.FormEvent) => {
    e.preventDefault();

    const disciplinaFinal =
      disciplinaSelecionada === 'Outra' ? outraDisciplina : disciplinaSelecionada;

    if (!disciplinaFinal) {
      alert('Por favor, selecione ou informe a disciplina.');
      return;
    }

    const { error } = await supabase.from('materiais').insert([
      {
        titulo,
        disciplina: disciplinaFinal,
        tipo,
        link_drive: linkDrive,
        descricao,
        professor_id: professorId,
        professor: professorNome,
        status: 'aprovado', // ou 'pendente' caso passe por moderação
      },
    ]);

    if (error) {
      console.error('Erro ao adicionar material:', error);
      alert('Erro ao enviar material. Tente novamente!');
      return;
    }

    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      onClose();
    }, 2000);
  };

  const materiaisFiltrados = materiaisExistentes.filter((m) =>
    m.titulo.toLowerCase().includes(buscaMaterial.toLowerCase()) ||
    m.disciplina?.toLowerCase().includes(buscaMaterial.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="bg-card border border-borda rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-texto-secundario hover:text-texto-principal text-lg font-bold cursor-pointer p-2"
        >
          ✕
        </button>

        {enviado ? (
          <div className="text-center py-8 space-y-2">
            <span className="text-4xl">📚</span>
            <h3 className="text-lg font-bold text-azul-texto">Material relacionado com sucesso!</h3>
            <p className="text-xs text-texto-secundario">
              O material foi associado ao docente {professorNome}.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-extrabold text-texto-principal">
                Relacionar Material 📚
              </h2>
              <p className="text-xs text-texto-secundario mt-1">
                Associar arquivos ao docente <strong className="text-azul-texto">{professorNome}</strong>.
              </p>
            </div>

            {/* Alternador de Modo: Buscar Existente vs Cadastrar Novo */}
            <div className="flex bg-fundo p-1 rounded-xl border border-borda text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModo('existente')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  modo === 'existente'
                    ? 'bg-card text-texto-principal shadow-sm border border-borda'
                    : 'text-texto-secundario hover:text-texto-principal'
                }`}
              >
                🔍 Buscar dos Materiais Cadastrados
              </button>
              <button
                type="button"
                onClick={() => setModo('novo')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  modo === 'novo'
                    ? 'bg-card text-texto-principal shadow-sm border border-borda'
                    : 'text-texto-secundario hover:text-texto-principal'
                }`}
              >
                ➕ Novo Link / Arquivo
              </button>
            </div>

            {/* ABA 1: Buscar do Banco Existente */}
            {modo === 'existente' && (
              <div className="space-y-3 pt-1">
                <input
                  type="text"
                  placeholder="Pesquisar por livro, prova, disciplina..."
                  value={buscaMaterial}
                  onChange={(e) => setBuscaMaterial(e.target.value)}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                />

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {loadingBusca ? (
                    <p className="text-center text-xs text-texto-secundario py-4">Carregando acervo...</p>
                  ) : materiaisFiltrados.length === 0 ? (
                    <p className="text-center text-xs text-texto-secundario py-4">
                      Nenhum material encontrado.
                    </p>
                  ) : (
                    materiaisFiltrados.map((mat) => (
                      <div
                        key={mat.id}
                        className="bg-fundo border border-borda p-3 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-azul-texto/50 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-texto-principal truncate">{mat.titulo}</p>
                          <p className="text-[10px] text-texto-secundario">
                            {mat.disciplina} • <span className="text-azul-texto">{mat.tipo}</span>
                          </p>
                          {mat.professor && (
                            <p className="text-[10px] text-emerald-400 mt-0.5">
                              Já associado a: {mat.professor}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleVincularMaterial(mat)}
                          className="px-3 py-1.5 bg-destaque hover:bg-blue-600 text-white font-bold rounded-lg text-[11px] transition-all whitespace-nowrap cursor-pointer shrink-0"
                        >
                          Relacionar
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ABA 2: Formulário de Novo Material */}
            {modo === 'novo' && (
              <form onSubmit={handleSubmitNovo} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Título do Material *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: George B Thomas V2 11ed"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Disciplina *
                  </label>
                  <div className="relative">
                    <select
                      value={disciplinaSelecionada}
                      onChange={(e) => setDisciplinaSelecionada(e.target.value)}
                      className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none appearance-none cursor-pointer pr-8"
                    >
                      {disciplinasCadastradas.map((d) => (
                        <option key={d} value={d} className="bg-[#18181b] text-white py-2">
                          {d}
                        </option>
                      ))}
                      <option value="Outra" className="bg-[#18181b] text-white py-2">
                        + Digitar outra disciplina...
                      </option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-texto-secundario text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {disciplinaSelecionada === 'Outra' && (
                  <div>
                    <label className="block text-xs font-semibold text-texto-secundario mb-1">
                      Nome da Nova Disciplina *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Digite a disciplina..."
                      value={outraDisciplina}
                      onChange={(e) => setOutraDisciplina(e.target.value)}
                      className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Tipo de Material *
                  </label>
                  <div className="relative">
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none appearance-none cursor-pointer pr-8"
                    >
                      {tiposMaterial.map((t) => (
                        <option key={t} value={t} className="bg-[#18181b] text-white py-2">
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-texto-secundario text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Link do Arquivo (Google Drive, PDF, etc.) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/..."
                    value={linkDrive}
                    onChange={(e) => setLinkDrive(e.target.value)}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Observações / Dicas adicionais <span className="text-[10px] text-texto-secundario/70">(opcional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Gabarito incluso na página 3."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-destaque hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Salvar e Relacionar Material
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}