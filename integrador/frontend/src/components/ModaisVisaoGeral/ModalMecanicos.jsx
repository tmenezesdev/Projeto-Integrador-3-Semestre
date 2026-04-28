import { Users, CheckCircle2 } from 'lucide-react';
import ModalBase from './ModalBase';

export default function ModalMecanicos({ open, onClose, transacoes }) {
  const mecanicos = Object.values(
    transacoes
      .filter(t => t.cargo === 'MECANICO')
      .reduce((acc, t) => {
        if (!acc[t.responsavel]) {
          acc[t.responsavel] = { nome: t.responsavel, cargo: t.cargo, total: 0, retiradas: 0, devolucoes: 0 };
        }
        acc[t.responsavel].total++;
        if (t.operacao === 'RETIRADA')  acc[t.responsavel].retiradas++;
        if (t.operacao === 'DEVOLUCAO') acc[t.responsavel].devolucoes++;
        return acc;
      }, {})
  ).sort((a, b) => b.total - a.total);

  return (
    <ModalBase open={open} onClose={onClose} title="Mecânicos Ativos Hoje" icon={Users}
      iconColor="text-emerald-400" iconBg="bg-emerald-500/10 border-emerald-500/20"
    >
      {mecanicos.length === 0 ? (
        <div className="py-16 text-center">
          <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-2 opacity-50" />
          <p className="text-slate-500 text-sm">Nenhum mecânico ativo hoje</p>
        </div>
      ) : (
        <div className="divide-y divide-teal-500/5">
          {mecanicos.map(m => (
            <div key={m.nome} className="px-6 py-3.5 flex items-center justify-between hover:bg-teal-500/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-emerald-400">
                    {m.nome?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{m.nome}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{m.cargo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-xs text-slate-500">
                    <span className="text-teal-400 font-bold">{m.retiradas}</span> ret ·{' '}
                    <span className="text-emerald-400 font-bold">{m.devolucoes}</span> dev
                  </p>
                  <p className="text-[11px] text-slate-600">{m.total} transações</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalBase>
  );
}