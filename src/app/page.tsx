// Exportamos a função principal da página (Home) que o Next.js renderiza na rota raiz ("/")
export default function Home() {
  return (
    // Elemento principal (<main>) estilizado com Tailwind CSS:
    // flex, flex-col, items-center, justify-center: Centralizam todo o conteúdo vertical e horizontalmente.
    // min-h-screen: Garante altura mínima igual a 100% da tela do usuário.
    // bg-slate-900 text-slate-100: Aplica fundo escuro e texto claro.
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-900 text-slate-100">
      
      {/* Contêiner interno flexível centralizando os elementos com espaçamento entre eles (space-y-6) */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-2xl">
        
        {/* Título principal do portal */}
        <h1 className="text-5xl font-extrabold tracking-tight text-blue-400">
          ΣΣ — Portal da Engenharia Elétrica
        </h1>
        
        {/* Descrição resumida da plataforma */}
        <p className="text-lg text-slate-300">
          Bem-vindo ao portal acadêmico! Aqui organizamos e facilitamos o acesso a informações, disciplinas, materiais e recursos da graduação.
        </p>

        {/* Tag indicativa da Fase 1 */}
        <div className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
          Fase 1 — Fundação Concluída
        </div>

      </div>

    </main>
  );
}