'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
}

interface ModalAdicionarProfessorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAdicionarProfessor({
  isOpen,
  onClose,
}: ModalAdicionarProfessorProps) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loadingDisciplinas, setLoadingDisciplinas] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Estados dos Campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [sala, setSala] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [passaLista, setPassaLista] = useState('');
  const [dicas, setDicas] = useState('');

  // Estados para Associação de Matéria
  const [materiaSelecionada, setMateriaSelecionada] = useState('');
  const [materiaManual, setMateriaManual] = useState('');

  useEffect(() => {
    if (isOpen) {
      carregarDisciplinas();
    }
  }, [isOpen]);

  async function carregarDisciplinas() {
    setLoadingDisciplinas(true);
    const { data, error } = await supabase
      .from('disciplinas')
      .select('id, nome, codigo')
      .order('nome', { ascending: true });

    if (!error && data) {
      setDisciplinas(data);
    }
    setLoadingDisciplinas(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setEnviando(true);

    const materiaFinal =
      materiaSelecionada === 'Outra' || !materiaSelecionada
        ? materiaManual.trim()
        : materiaSelecionada;

    const novoProfessor = {
      nome: nome.trim(),
      email: email.trim() || null,
      sala: sala.trim() || null,
      dificuldade: dificuldade || null,
      passa_lista: passaLista || null,
      dicas: dicas.trim() || null,
      materia: materiaFinal || null,
      status: 'aprovado',
    };

    const { error } = await supabase.from('professores').insert([novoProfessor]);

    if (!error) {
      alert('Docente cadastrado com sucesso!');
      setNome('');
      setEmail('');
      setSala('');
      setDificuldade('');
      setPassaLista('');
      setDicas('');
      setMateriaSelecionada('');
      setMateriaManual('');
      onClose();
    } else {
      alert('Erro ao cadastrar docente: ' + error.message);
    }

    setEnviando(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-borda w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-borda pb-3">
          <div>
            <h2 className="text-base font-extrabold text-texto-principal flex items-center gap-1.5">
              Adicionar Docente <span className="text-azul-texto">+</span>
            </h2>
            <p className="text-[11px] text-texto-secundario">
              Sugira as informações de um professor para ajudar na grade do curso.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-texto-secundario hover:text-texto-principal text-sm p-1 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nome do Docente */}
          <div>
            <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
              Nome do Docente *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Fausto De Camargo Júnior"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none"
            />
          </div>

          {/* Relacionar a uma Matéria Cadastrada */}
          <div>
            <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
              Relacionar a uma Matéria Cadastrada <span className="font-normal">(opcional)</span>
            </label>
            <select
              value={materiaSelecionada}
              onChange={(e) => setMateriaSelecionada(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none cursor-pointer"
            >
              <option value="" className="bg-card text-texto-principal">
                Selecione uma matéria existente...
              </option>
              {loadingDisciplinas ? (
                <option disabled className="bg-card text-texto-secundario">
                  Carregando matérias...
                </option>
              ) : (
                disciplinas.map((d) => (
                  <option key={d.id} value={d.nome} className="bg-card text-texto-principal">
                    {d.codigo} - {d.nome}
                  </option>
                ))
              )}
              <option value="Outra" className="bg-card text-texto-principal">
                + Digitar matéria manualmente / Observação...
              </option>
            </select>
          </div>

          {/* Nome da Matéria Manual */}
          {(materiaSelecionada === 'Outra' || materiaSelecionada === '') && (
            <div>
              <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                Nome da Matéria / Detalhes das Disciplinas <span className="font-normal">(opcional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Digite o nome da matéria ou adicione observações sobre quais matérias ele leciona..."
                value={materiaManual}
                onChange={(e) => setMateriaManual(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none resize-y"
              />
            </div>
          )}

          {/* E-mail e Sala */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                E-mail de Contato <span className="font-normal">(opcional)</span>
              </label>
              <input
                type="email"
                placeholder="exemplo@cefetmg.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                Sala / Prédio <span className="font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Sala 204 - Prédio 2"
                value={sala}
                onChange={(e) => setSala(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none"
              />
            </div>
          </div>

          {/* Nível de Exigência */}
          <div>
            <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
              Nível de Exigência <span className="font-normal">(opcional)</span>
            </label>
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none cursor-pointer"
            >
              <option value="" className="bg-card text-texto-principal">
                Não informado
              </option>
              <option value="Tranquilo" className="bg-card text-texto-principal">
                Tranquilo
              </option>
              <option value="Médio" className="bg-card text-texto-principal">
                Médio
              </option>
              <option value="Exigente" className="bg-card text-texto-principal">
                Exigente
              </option>
            </select>
          </div>

          {/* Cobra Presença */}
          <div>
            <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
              Cobra Presença <span className="font-normal">(opcional)</span>
            </label>
            <select
              value={passaLista}
              onChange={(e) => setPassaLista(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none cursor-pointer"
            >
              <option value="" className="bg-card text-texto-principal">
                Não informado
              </option>
              <option value="Sempre" className="bg-card text-texto-principal">
                Sempre
              </option>
              <option value="Às vezes" className="bg-card text-texto-principal">
                Às vezes
              </option>
              <option value="Raramente" className="bg-card text-texto-principal">
                Raramente
              </option>
              <option value="Não cobra" className="bg-card text-texto-principal">
                Não cobra
              </option>
            </select>
          </div>

          {/* Dicas e Visão Geral */}
          <div>
            <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
              Dicas e Visão Geral <span className="font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Cobra muita teoria nas provas, dá ponto por participação, etc."
              value={dicas}
              onChange={(e) => setDicas(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none resize-y"
            />
          </div>

          {/* Botão de Enviar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={enviando}
              className="w-full py-3 bg-destaque hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Enviar para Moderação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}