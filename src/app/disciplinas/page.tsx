'use client';

import { useState } from 'react';

interface ModalAdicionarDisciplinaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (disciplina: { nome: string; codigo: string; tipo: string; periodo: string }) => void;
}

export default function ModalAdicionarDisciplina({
  isOpen,
  onClose,
  onSave,
}: ModalAdicionarDisciplinaProps) {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [tipo, setTipo] = useState<'Obrigatória' | 'Optativa'>('Obrigatória');
  const [periodo, setPeriodo] = useState('1º Período');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({ nome, codigo, tipo, periodo });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-borda w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-borda pb-3">
          <h2 className="text-base font-extrabold text-texto-principal">
            Cadastrar Nova Disciplina
          </h2>
          <button
            onClick={onClose}
            className="text-texto-secundario hover:text-texto-principal text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
              Nome da Disciplina
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Sistemas Digitais"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none"
            />
          </div>

          {/* Código */}
          <div>
            <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
              Código da Disciplina
            </label>
            <input
              type="text"
              required
              placeholder="Ex: ELC102"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none"
            />
          </div>

          {/* Tipo da Disciplina (Botões com Destaque Visual) */}
          <div>
            <label className="block text-[11px] font-semibold text-texto-secundario mb-1.5">
              Tipo da Disciplina
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipo('Obrigatória')}
                className={`py-2.5 px-4 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  tipo === 'Obrigatória'
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500 shadow-sm'
                    : 'bg-fundo text-texto-secundario border-borda hover:border-gray-500'
                }`}
              >
                {tipo === 'Obrigatória' && '✓ '}Obrigatória
              </button>

              <button
                type="button"
                onClick={() => setTipo('Optativa')}
                className={`py-2.5 px-4 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  tipo === 'Optativa'
                    ? 'bg-purple-600/20 text-purple-400 border-purple-500 shadow-sm'
                    : 'bg-fundo text-texto-secundario border-borda hover:border-gray-500'
                }`}
              >
                {tipo === 'Optativa' && '✓ '}Optativa
              </button>
            </div>
          </div>

          {/* Período (Com correção de contraste no menu suspenso) */}
          {tipo === 'Obrigatória' && (
            <div>
              <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                Qual Período?
              </label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                  <option key={p} value={`${p}º Período`} className="bg-[#121212] text-white">
                    {p}º Período
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-fundo hover:bg-borda/30 text-texto-principal border border-borda text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-destaque hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Salvar Disciplina
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}