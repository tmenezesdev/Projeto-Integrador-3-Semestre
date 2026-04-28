import { BarChart3, CheckCircle2 } from 'lucide-react';
import ModalBase from './ModalBase';

const TIPO_MAP = {
  RETIRADA:  { label: 'Retirada',  cls: 'bg-teal-500/10 text-teal-400 border-teal-500/20'   },
  DEVOLUCAO: { label: 'Devolução', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

export default function ModalTransacoes({ open, onClose, transacoes }) {
  return (
    <ModalBase open={open} onClose={onClose} title="Transações Hoje" icon={BarChart3}>
      {transacoes.length === 0 ? (
        <div className="py-16 text-center">
          <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-2 opacity-50" />
          <p className="text-slate-500 text-sm">Nenhuma transação registrada hoje</p>
        </div>
      ) : (
        <div className="divide-y divide-teal-500/5">
          {transacoes.map(t => {
            const tipo = TIPO_MAP[t.operacao] ?? { label: t.operacao, cls: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
            return (
              <div key={t.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-teal-500/5 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white">{t.ferramenta}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{t.responsavel} · {t.dataHora}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tipo.cls}`}>
                  {tipo.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </ModalBase>
  );
}