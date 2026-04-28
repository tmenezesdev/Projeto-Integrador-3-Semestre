import { Loader2, Package } from 'lucide-react';
import ModalBase from './ModalBase';

function StatusBadge({ status }) {
  const map = {
    DISPONIVEL: { label: 'Disponível', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    EM_USO:     { label: 'Em Uso',     cls: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    ATRASADA:   { label: 'Atrasada',   cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    MANUTENCAO: { label: 'Manutenção', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function ModalInventario({ open, onClose, ferramentas, loading }) {
  return (
    <ModalBase open={open} onClose={onClose} title="Inventário Completo" icon={Package}>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-teal-400 w-6 h-6" />
        </div>
      ) : (
        <div className="divide-y divide-teal-500/5">
          {ferramentas.map(f => (
            <div key={f.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-teal-500/5 transition-colors">
              <div>
                <p className="text-sm font-medium text-white">{f.nome}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{f.tagRfid}</p>
              </div>
              <div className="flex items-center gap-3">
                {f.responsavel && (
                  <span className="text-[11px] text-slate-500 hidden sm:block">{f.responsavel}</span>
                )}
                <StatusBadge status={f.statusAlerta} />
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalBase>
  );
}