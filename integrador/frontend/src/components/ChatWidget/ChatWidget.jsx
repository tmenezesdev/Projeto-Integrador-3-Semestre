'use client';
import { BASE_URL } from '@/lib/apiConfig';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Headphones, X, Send, MessageSquare } from 'lucide-react';

const API        = BASE_URL + '/api/chat';
const API_STATUS = BASE_URL + '/api/chat/status';
const token = () => localStorage.getItem('smartbench_token');

const COR = {
  ADMIN: {
    avatar: 'bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/40 text-purple-600 dark:text-purple-300',
    badge:  'bg-purple-50  dark:bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    bolha:  'border-purple-200 dark:border-purple-500/20',
  },
  SUPERVISOR: {
    avatar: 'bg-blue-100 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/40 text-blue-600 dark:text-blue-300',
    badge:  'bg-blue-50  dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    bolha:  'border-blue-200 dark:border-blue-500/20',
  },
  MECANICO: {
    avatar: 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300',
    badge:  'bg-amber-50  dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    bolha:  'border-amber-200 dark:border-amber-500/20',
  },
};

export default function ChatWidget() {
  const [chatAtivo, setChatAtivo] = useState(true);
  const [open, setOpen]           = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto]         = useState('');
  const [enviando, setEnviando]   = useState(false);
  const [seenId, setSeenId]       = useState(0);

  const listRef = useRef(null);

  useEffect(() => {
    const verificar = async () => {
      try {
        const res = await fetch(API_STATUS, { headers: { Authorization: `Bearer ${token()}` } });
        if (!res.ok) return;
        const data = await res.json();
        setChatAtivo(data.chat_ativo);
      } catch {}
    };
    verificar();
  }, []);

  const carregar = useCallback(async () => {
    try {
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token()}` } });
      if (!res.ok) return;
      setMensagens(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    if (!chatAtivo) return;
    carregar();
    const id = setInterval(carregar, 4000);
    return () => clearInterval(id);
  }, [carregar, chatAtivo]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [mensagens, open]);

  if (chatAtivo === false) return null;

  const handleOpen = () => {
    setOpen(true);
    if (mensagens.length) setSeenId(mensagens[mensagens.length - 1].id);
  };

  const handleClose = () => {
    setOpen(false);
    if (mensagens.length) setSeenId(mensagens[mensagens.length - 1].id);
  };

  const unread = open ? 0 : mensagens.filter(m => m.id > seenId).length;

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    try {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ conteudo: texto.trim() }),
      });
      setTexto('');
      await carregar();
    } catch {}
    finally { setEnviando(false); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* PAINEL */}
      {open && (
        <div className="w-[370px] bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl dark:shadow-black/40 flex flex-col overflow-hidden"
             style={{ height: 500 }}>

          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-[#0f0f11]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center">
                <Headphones size={14} className="text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-white">Chat da Equipe</span>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <X size={15} />
            </button>
          </div>

          {/* Mensagens */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {mensagens.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-10">
                <MessageSquare size={32} className="text-slate-300 dark:text-slate-700" />
                <p className="text-slate-400 dark:text-slate-500 text-sm">Nenhuma mensagem ainda.</p>
                <p className="text-slate-300 dark:text-slate-700 text-xs">Seja o primeiro a enviar!</p>
              </div>
            ) : mensagens.map((msg) => {
              const cor = COR[msg.perfil] ?? COR.MECANICO;
              const hora = new Date(msg.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={msg.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border flex-shrink-0 overflow-hidden ${!msg.foto_url ? cor.avatar : 'border-white/20'} flex items-center justify-center`}>
                      {msg.foto_url
                        ? <img src={msg.foto_url} alt={msg.nome} className="w-full h-full object-cover" />
                        : <span className={`text-[11px] font-bold ${cor.avatar.split(' ').find(c => c.startsWith('text-'))}`}>{msg.nome?.[0]?.toUpperCase()}</span>
                      }
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-white leading-none">{msg.nome}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${cor.badge}`}>
                      {msg.perfil}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-600 ml-auto">{hora}</span>
                  </div>
                  <div className={`ml-8 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#1a1a1d] border ${cor.bolha} rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed break-words`}>
                    {msg.conteudo}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <form onSubmit={enviar} className="p-3 border-t border-slate-200 dark:border-white/8 flex gap-2">
            <input
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="Escreva uma mensagem..."
              autoComplete="off"
              className="flex-1 bg-slate-100 dark:bg-[#1a1a1d] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
            />
            <button
              type="submit"
              disabled={!texto.trim() || enviando}
              className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0"
            >
              <Send size={14} className="text-black" />
            </button>
          </form>
        </div>
      )}

      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={open ? handleClose : handleOpen}
        className="relative w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/25 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        {open
          ? <X size={22} className="text-black" />
          : <Headphones size={22} className="text-black" />
        }
        {!open && unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 border-2 border-white dark:border-[#09090A] flex items-center justify-center text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

    </div>
  );
}
