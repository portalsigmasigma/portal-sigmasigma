'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  disciplinaNome: string;
}

interface MaterialExistente {
  id: string;
  titulo: string;
  disciplina: string;
  tipo: string;
  link_drive: string;
  professor?: string;
}

export default function ModalAdicionarMaterialDisciplina({
  isOpen,
  onClose,
  disciplinaNome,
}: ModalProps) {
  const [modo, setModo] = useState<'existente' | 'novo'>('existente');
  const [enviado, setEnviado] = useState(false);

  // Estados para busca/vínculo de materiais existentes
  const [buscaMaterial, setBuscaMaterial] = useState('');
  const [materiaisExistentes, setMateriaisExistentes] = useState<MaterialExistente[]>([]);
  const [loadingBusca, setLoadingBusca] = useState(false);

  // Estados para formulário de NOVO material
  const [titulo, setTitulo] = useState('');
  const [professoresCadastrados, setProfessoresCadastrados] = useState<string[]>([]);
  const [professorSelecionado, setProfessorSelecionado] = useState('');
  const [outroProfessor, setOutroProfessor] = useState('');
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
      fetchProfessores();
      fetchMateriaisExistentes();
    }
  }, [isOpen]);

  // Busca todos os materiais já cadastrados para permitir vincular a esta disciplina
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

  // Busca docentes para o select opcional de cadastrar novo material
  const fetchProfessores = async () => {
    try {
      const { data } = await supabase.from('professores').select('nome');
      if (data) {
        const nomes = data.map((p) => p.nome).filter(Boolean).sort();
        setProfessoresCadastrados(nomes);
      }
    } catch {
      setProfessoresCadastrados([]);
    }
  };

  if (!isOpen) return null;

  // Vincular um material JÁ EXISTENTE no banco a ESTA disciplina
  const handleVincularMaterial = async (mat: MaterialExistente) => {
    const { error } = await supabase
      .from('materiais')
      .update({
        disciplina: disciplinaNome,
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

  // Cadastrar um NOVO material vinculado a ESTA disciplina
  const handleSubmitNovo = async (e: React.FormEvent) => {
    e.preventDefault();

    const professorFinal =
      professorSelecionado === 'Outro'
        ? outroProfessor
        : professorSelecionado;

    const { error } = await supabase.from('materiais').insert([
      {
        titulo,
        disciplina: disciplinaNome,
        tipo,
        link_drive: linkDrive,
        descricao,
        professor: professorFinal || null,
        status: 'aprovado',
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

  const materiaisFiltrados = materiaisExistentes.filter(
    (m) =>
      m.titulo.toLowerCase().includes(buscaMaterial.toLowerCase()) ||
      m.professor?.toLowerCase().includes(buscaMaterial.toLowerCase()) ||
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
            <h3 className="text-lg font-bold text-azul-texto">
              Material relacionado com sucesso!
            </h3>
            <p className="text-xs text-texto-secundario">
              O material foi associado à disciplina <strong className="text-azul-texto">{disciplinaNome}</strong>.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-extrabold text-texto-principal">
                Relacionar Material 📚
              </h2>
              <p className="text-xs text-texto-secundario mt-1">
                Associar arquivos à disciplina <strong className="text-azul-texto">{disciplinaNome}</strong>.
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
                  placeholder="Pesquisar por livro, prova, professor..."
                  value={buscaMaterial}
                  onChange={(e) => setBuscaMaterial(e.target.value)}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                />

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {loadingBusca ? (
                    <p className="text-center text-xs text-texto-secundario py-4">
                      Carregando acervo...
                    </p>
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
                          <p className="font-bold text-texto-principal truncate">
                            {mat.titulo}
                          </p>
                          <p className="text-[10px] text-texto-secundario">
                            <span className="text-azul-texto">{mat.tipo}</span>
                            {mat.professor && ` • Prof. ${mat.professor}`}
                          </p>
                          {mat.disciplina && (
                            <p className="text-[10px] text-emerald-400 mt-0.5">
                              Já associado a: {mat.disciplina}
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
                    placeholder="Ex: P1 2023 - Gabarito Oficial"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Professor / Docente <span className="text-[10px] text-texto-secundario/70">(opcional)</span>
                  </label>
                  <div className="relative">
                    <select
                      value={professorSelecionado}
                      onChange={(e) => setProfessorSelecionado(e.target.value)}
                      className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none appearance-none cursor-pointer pr-8"
                    >
                      <option value="" className="bg-[#18181b] text-white py-2">
                        -- Nenhum / Não especificado --
                      </option>
                      {professoresCadastrados.map((p) => (
                        <option key={p} value={p} className="bg-[#18181b] text-white py-2">
                          {p}
                        </option>
                      ))}
                      <option value="Outro" className="bg-[#18181b] text-white py-2">
                        + Digitar outro professor...
                      </option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-texto-secundario text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {professorSelecionado === 'Outro' && (
                  <div>
                    <label className="block text-xs font-semibold text-texto-secundario mb-1">
                      Nome do Docente *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Digite o nome do professor..."
                      value={outroProfessor}
                      onChange={(e) => setOutroProfessor(e.target.value)}
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