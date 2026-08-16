'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  periodo?: string;
  tipo?: string; // 'obrigatoria' ou 'optativa'
  ementa?: string;
  status?: string;
}

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [periodoFiltro, setPeriodoFiltro] = useState('todos');

  // Modal de Adicionar Disciplina
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoCodigo, setNovoCodigo] = useState('');
  const [novoPeriodo, setNovoPeriodo] = useState('');
  const [novoTipo, setNovoTipo] = useState('obrigatoria');
  const [novaEmenta, setNovaEmenta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [erroMensagem, setErroMensagem] = useState<string | null>(null);

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  async function fetchDisciplinas() {
    setLoading(true);
    
    // Busca apenas disciplinas aprovadas (ou sem o status restritivo 'pendente')
    const { data, error } = await supabase
      .from('disciplinas')
      .select('*')
      .or('status.eq.aprovado,status.is.null')
      .order('codigo', { ascending: true });

    if (!error && data) {
      setDisciplinas(data);
    } else {
      console.error('Erro ao carregar disciplinas:', error);
    }
    setLoading(false);
  }

  const handleCriarDisciplina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novoCodigo.trim()) return;

    setEnviando(true);
    setErroMensagem(null);

    const novaDisciplina: Record<string, any> = {
      nome: novoNome.trim(),
      codigo: novoCodigo.trim().toUpperCase(),
      tipo: novoTipo,
      status: 'pendente', // Enviado como pendente para moderação
    };

    if (novoPeriodo) novaDisciplina.periodo = novoPeriodo;
    if (novaEmenta.trim()) novaDisciplina.ementa = novaEmenta.trim();

    const { error } = await supabase
      .from('disciplinas')
      .insert([novaDisciplina]);

    if (error) {
      console.error('Erro ao enviar disciplina:', error);
      setErroMensagem(`Erro (${error.code}): ${error.message}`);
    } else {
      setMensagemSucesso(true);
      setNovoNome('');
      setNovoCodigo('');
      setNovoPeriodo('');
      setNovoTipo('obrigatoria');
      setNovaEmenta('');

      // Fecha a mensagem e o modal após 2.5 segundos
      setTimeout(() => {
        setMensagemSucesso(false);
        setIsModalOpen(false);
      }, 2500);
    }

    setEnviando(false);
  };

  // Filtragem local por texto e período
  const disciplinasFiltradas = disciplinas.filter((d) => {
    const atendeBusca =
      d.nome.toLowerCase().includes(busca.toLowerCase()) ||
      d.codigo.toLowerCase().includes(busca.toLowerCase());

    const atendePeriodo =
      periodoFiltro === 'todos' || d.periodo === periodoFiltro;

    return atendeBusca && atendePeriodo;
  });

  const optionStyle = {
    backgroundColor: '#121212',
    color: '#ffffff',
  };

  return (
    <main className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Botão Voltar para o Início */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-texto-secundario hover:text-azul-texto transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Voltar para o Início</span>
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borda pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-texto-principal flex items-center gap-2">
            Disciplinas do Curso <span className="text-azul-texto">📚</span>
          </h1>
          <p className="text-xs text-texto-secundario mt-1">
            Explore as matérias, veja ementas e navegue pelos materiais de estudo.
          </p>
        </div>

        <button
          onClick={() => {
            setMensagemSucesso(false);
            setErroMensagem(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-destaque hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span>➕</span> Cadastrar Disciplina
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Campo de Pesquisa */}
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Buscar por nome da matéria ou código (Ex: Cálculo, ELE101)..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full text-xs p-3 rounded-xl bg-card border border-borda text-texto-principal focus:border-azul-texto outline-none"
          />
        </div>

        {/* Filtro por Período */}
        <div>
          <select
            value={periodoFiltro}
            onChange={(e) => setPeriodoFiltro(e.target.value)}
            className="w-full text-xs p-3 rounded-xl bg-card border border-borda text-texto-principal focus:border-azul-texto outline-none cursor-pointer"
          >
            <option value="todos" style={optionStyle}>
              Todos os Períodos
            </option>
            <option value="1º Período" style={optionStyle}>1º Período</option>
            <option value="2º Período" style={optionStyle}>2º Período</option>
            <option value="3º Período" style={optionStyle}>3º Período</option>
            <option value="4º Período" style={optionStyle}>4º Período</option>
            <option value="5º Período" style={optionStyle}>5º Período</option>
            <option value="6º Período" style={optionStyle}>6º Período</option>
            <option value="7º Período" style={optionStyle}>7º Período</option>
            <option value="8º Período" style={optionStyle}>8º Período</option>
            <option value="9º Período" style={optionStyle}>9º Período</option>
            <option value="10º Período" style={optionStyle}>10º Período</option>
            <option value="Optativa" style={optionStyle}>Optativas</option>
          </select>
        </div>
      </div>

      {/* Grid de Disciplinas */}
      {loading ? (
        <div className="p-12 text-center text-xs text-texto-secundario">
          Carregando disciplinas...
        </div>
      ) : disciplinasFiltradas.length === 0 ? (
        <div className="bg-card border border-borda rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-texto-principal">
            Nenhuma disciplina encontrada.
          </p>
          <p className="text-xs text-texto-secundario">
            Tente ajustar os termos de busca ou cadastre a disciplina faltante.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-azul-texto font-bold hover:underline cursor-pointer"
          >
            Cadastrar nova matéria
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {disciplinasFiltradas.map((d) => (
            <Link
              key={d.id}
              href={`/disciplinas/${d.id}`}
              className="bg-card border border-borda hover:border-azul-texto rounded-2xl p-5 space-y-3 transition-all hover:shadow-lg group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold text-azul-texto bg-fundo px-2.5 py-1 rounded-md border border-borda uppercase tracking-wider">
                    {d.codigo}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-texto-secundario">
                    {d.tipo && (
                      <span className="capitalize text-[10px] bg-borda/40 px-2 py-0.5 rounded">
                        {d.tipo}
                      </span>
                    )}
                    {d.periodo && <span>{d.periodo}</span>}
                  </div>
                </div>

                <h2 className="text-base font-bold text-texto-principal group-hover:text-azul-texto transition-colors line-clamp-2">
                  {d.nome}
                </h2>

                {d.ementa && (
                  <p className="text-xs text-texto-secundario line-clamp-2 leading-relaxed">
                    {d.ementa}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-borda/60 flex items-center justify-between text-xs text-azul-texto font-bold">
                <span>Ver detalhes e materiais</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal de Adicionar Disciplina */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-borda w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-borda pb-3">
              <div>
                <h2 className="text-base font-extrabold text-texto-principal flex items-center gap-1.5">
                  Cadastrar Disciplina <span className="text-azul-texto">+</span>
                </h2>
                <p className="text-[11px] text-texto-secundario">
                  Sugira uma nova disciplina para a grade do curso.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="text-texto-secundario hover:text-texto-principal text-sm p-1 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Aviso de Sucesso Interno */}
            {mensagemSucesso ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center space-y-1">
                <p className="text-xs font-bold text-green-400">
                  ✓ Disciplina enviada para moderação!
                </p>
                <p className="text-[11px] text-texto-secundario">
                  Ela estará visível para todos assim que for aprovada pelos moderadores.
                </p>
              </div>
            ) : (
              /* Form Modal */
              <form onSubmit={handleCriarDisciplina} className="space-y-3">
                {erroMensagem && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400">
                    {erroMensagem}
                  </div>
                )}

                {/* Código */}
                <div>
                  <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                    Código da Disciplina *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: G00ESTA1.01"
                    value={novoCodigo}
                    onChange={(e) => setNovoCodigo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none uppercase"
                  />
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                    Nome da Disciplina *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: ESTATÍSTICA"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none"
                  />
                </div>

                {/* Tipo de Disciplina */}
                <div>
                  <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                    Tipo de Disciplina *
                  </label>
                  <select
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none cursor-pointer"
                  >
                    <option value="obrigatoria" style={optionStyle}>Obrigatória</option>
                    <option value="optativa" style={optionStyle}>Optativa</option>
                  </select>
                </div>

                {/* Período */}
                <div>
                  <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                    Período <span className="font-normal">(opcional)</span>
                  </label>
                  <select
                    value={novoPeriodo}
                    onChange={(e) => setNovoPeriodo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none cursor-pointer"
                  >
                    <option value="" style={optionStyle}>Não informado / Variado</option>
                    <option value="1º Período" style={optionStyle}>1º Período</option>
                    <option value="2º Período" style={optionStyle}>2º Período</option>
                    <option value="3º Período" style={optionStyle}>3º Período</option>
                    <option value="4º Período" style={optionStyle}>4º Período</option>
                    <option value="5º Período" style={optionStyle}>5º Período</option>
                    <option value="6º Período" style={optionStyle}>6º Período</option>
                    <option value="7º Período" style={optionStyle}>7º Período</option>
                    <option value="8º Período" style={optionStyle}>8º Período</option>
                    <option value="9º Período" style={optionStyle}>9º Período</option>
                    <option value="10º Período" style={optionStyle}>10º Período</option>
                  </select>
                </div>

                {/* Ementa / Descrição */}
                <div>
                  <label className="block text-[11px] font-semibold text-texto-secundario mb-1">
                    Ementa / Resumo dos Tópicos <span className="font-normal">(opcional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Resumo dos tópicos abordados na disciplina..."
                    value={novaEmenta}
                    onChange={(e) => setNovaEmenta(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-fundo border border-borda text-texto-principal focus:border-azul-texto outline-none resize-y"
                  />
                </div>

                {/* Botão Enviar */}
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
            )}
          </div>
        </div>
      )}
    </main>
  );
}