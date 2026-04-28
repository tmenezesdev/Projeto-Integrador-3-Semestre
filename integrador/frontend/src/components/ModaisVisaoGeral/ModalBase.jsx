import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function ModalBase({ open, onClose, title, icon: Icon, iconColor = 'text-teal-400', iconBg = 'bg-teal-500/10 border-teal-500/20', children }) {
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-[#0a1628] border border-teal-500/20 rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-teal-500/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${iconBg}`}>
              <Icon size={15} className={iconColor} />
            </div>
            <h2 className="text-sm font-semibold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-teal-500/5 hover:bg-teal-500/10 border border-teal-500/10 flex items-center justify-center transition-colors cursor-pointer">
            <X size={13} className="text-slate-400" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}