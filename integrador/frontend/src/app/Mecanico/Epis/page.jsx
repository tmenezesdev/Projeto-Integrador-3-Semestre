'use client';

import {
  HardHat, Hand, Eye, Ear, Footprints, Shirt,
  AlertTriangle, CheckCircle2, ShieldCheck, TrendingUp, Users, HeartHandshake, Zap
} from 'lucide-react';

const epis = [
  {
    icon: HardHat,
    nome: 'Capacete de Segurança',
    descricao: 'Protege contra quedas de objetos e impactos na cabeça durante qualquer atividade na oficina.',
    img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80&fit=crop&auto=format',
  },
  {
    icon: Hand,
    nome: 'Luvas de Proteção',
    descricao: 'Evitam cortes, abrasões, queimaduras e contato direto com materiais ou substâncias perigosas.',
    img: 'https://media.istockphoto.com/id/2190518272/pt/foto/close-up-technician-engineer-wearing-and-adjust-protective-safety-glove-safety-equipment-for.webp?a=1&b=1&s=612x612&w=0&k=20&c=G8tuzChfclRjDScKICvy6BoNCey4wn6iZusIgxnFTJw=',
  },
  {
    icon: Eye,
    nome: 'Óculos de Proteção',
    descricao: 'Protegem os olhos contra poeira, faíscas, lascas e respingos químicos.',
    img: 'https://images.unsplash.com/photo-1646119871092-93532e81f391?w=600&q=80&fit=crop&auto=format',
  },
  {
    icon: Ear,
    nome: 'Protetor Auricular',
    descricao: 'Reduz a exposição a ruídos acima de 85 dB, prevenindo danos auditivos permanentes.',
    img: 'https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc?w=600&q=80&fit=crop&auto=format',
  },
  {
    icon: Footprints,
    nome: 'Botina de Segurança',
    descricao: 'Protege os pés contra impactos, perfurações e esmagamentos por ferramentas e objetos pesados.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop&auto=format',
  },
  {
    icon: Shirt,
    nome: 'Avental de Proteção',
    descricao: 'Protege o corpo contra respingos, faíscas e agentes químicos durante o trabalho com ferramentas.',
    img: 'https://plus.unsplash.com/premium_photo-1661503440465-a9ec448adb89?w=600&q=80&fit=crop&auto=format',
  },
];

const stats = [
  { valor: '80%', label: 'dos acidentes de trabalho são evitáveis com o uso correto de EPIs', icon: ShieldCheck },
  { valor: '6x',  label: 'menor risco de lesão grave quando o EPI adequado é utilizado', icon: TrendingUp },
  { valor: '300k', label: 'acidentes de trabalho registrados por ano no Brasil (AEAT/MPS)', icon: Users },
];

const pilares = [
  {
    icon: ShieldCheck,
    titulo: 'Proteção individual',
    texto: 'Cada EPI foi desenvolvido para uma ameaça específica. Usar o equipamento certo para cada tarefa é o que transforma risco em segurança.',
  },
  {
    icon: HeartHandshake,
    titulo: 'Responsabilidade coletiva',
    texto: 'Quando você se protege, protege também quem trabalha ao seu lado. A segurança é um compromisso de todos, não só de um.',
  },
  {
    icon: Zap,
    titulo: 'Acidentes acontecem rápido',
    texto: 'A maioria dos acidentes ocorre em segundos — sem aviso prévio. O EPI precisa estar em uso antes do risco aparecer, não depois.',
  },
];

const normas = [
  'Utilizar os EPIs antes de iniciar qualquer atividade na oficina.',
  'Inspecionar o equipamento antes do uso — EPI danificado não protege.',
  'Não emprestar ou compartilhar EPIs sem higienização prévia.',
  'Comunicar imediatamente ao supervisor caso o EPI esteja danificado ou extraviado.',
];

export default function EpisPage() {
  return (
    <div className="p-8 font-sans">

      {/* HEADER */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <HardHat size={32} className="text-amber-400" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Segurança & EPIs</h1>
        </div>
        <p className="text-sm text-slate-400 ml-11">
          Bem-vindo. Antes de qualquer atividade, revise seus equipamentos de proteção.
        </p>
      </header>

      {/* AVISO NR-6 */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 flex items-start gap-4 mb-8">
        <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-300 font-semibold text-sm">Uso obrigatório — NR-6 (Ministério do Trabalho)</p>
          <p className="text-slate-400 text-sm mt-0.5">
            O uso de EPIs é obrigatório por lei. A ausência de proteção coloca sua saúde e integridade
            física em risco. Não inicie nenhuma atividade sem os equipamentos corretos.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ valor, label, icon: Icon }) => (
          <div key={valor} className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5 flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon size={17} className="text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-amber-400 leading-none">{valor}</p>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GRID DE EPIs */}
      <section className="mb-8">
        <h2 className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">
          Equipamentos obrigatórios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {epis.map(({ icon: Icon, nome, descricao, img }) => (
            <div
              key={nome}
              className="bg-[#1a1000] border border-amber-500/10 rounded-xl overflow-hidden hover:border-amber-500/30 transition-colors group"
            >
              <div className="relative h-48 overflow-hidden bg-[#0f0900]">
                <img
                  src={img}
                  alt={nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1000] via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm flex items-center justify-center">
                    <Icon size={17} className="text-amber-400" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-white text-sm">{nome}</p>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CULTURA DE SEGURANÇA */}
      <section className="mb-8">
        <h2 className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">
          Por que a segurança importa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {pilares.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <Icon size={17} className="text-amber-400" />
              </div>
              <p className="font-semibold text-white text-sm mb-2">{titulo}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NORMAS */}
      <section>
        <h2 className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">
          Normas de uso
        </h2>
        <div className="bg-[#1a1000] border border-amber-500/10 rounded-xl p-5 flex flex-col gap-3">
          {normas.map((norma, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">{norma}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
