package com.smartbench.app.ui.chat;

import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.smartbench.app.R;
import com.smartbench.app.data.model.entity.ChatMensagem;
import com.smartbench.app.utils.ColorUtils;
import com.smartbench.app.utils.DateUtils;

import java.util.ArrayList;
import java.util.List;

public class ChatAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private static final int TIPO_PROPRIO = 0;
    private static final int TIPO_OUTRO   = 1;

    private List<ChatMensagem> lista = new ArrayList<>();
    private String meuNome = "";

    public void setData(List<ChatMensagem> data, String meuNome) {
        this.lista = data != null ? data : new ArrayList<>();
        this.meuNome = meuNome;
        notifyDataSetChanged();
    }

    @Override
    public int getItemViewType(int position) {
        return meuNome.equals(lista.get(position).nome) ? TIPO_PROPRIO : TIPO_OUTRO;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inf = LayoutInflater.from(parent.getContext());
        if (viewType == TIPO_PROPRIO) {
            return new VHProprio(inf.inflate(R.layout.item_chat_proprio, parent, false));
        }
        return new VHOutro(inf.inflate(R.layout.item_chat_outro, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        ChatMensagem msg = lista.get(position);
        if (holder instanceof VHProprio) ((VHProprio) holder).bind(msg);
        else ((VHOutro) holder).bind(msg);
    }

    @Override
    public int getItemCount() { return lista.size(); }

    // ── Mensagem própria (direita) ──────────────────────────────────────────
    static class VHProprio extends RecyclerView.ViewHolder {
        final TextView tvConteudo, tvHora;

        VHProprio(View v) {
            super(v);
            tvConteudo = v.findViewById(R.id.tvConteudo);
            tvHora     = v.findViewById(R.id.tvHora);
        }

        void bind(ChatMensagem msg) {
            tvConteudo.setText(msg.conteudo);
            tvHora.setText(DateUtils.formatTimeOnly(msg.criadoEm));
        }
    }

    // ── Mensagem de outro usuário (esquerda) ────────────────────────────────
    static class VHOutro extends RecyclerView.ViewHolder {
        final TextView tvNome, tvConteudo, tvHora, tvAvatar;

        VHOutro(View v) {
            super(v);
            tvNome     = v.findViewById(R.id.tvNome);
            tvConteudo = v.findViewById(R.id.tvConteudo);
            tvHora     = v.findViewById(R.id.tvHora);
            tvAvatar   = v.findViewById(R.id.tvAvatar);
        }

        void bind(ChatMensagem msg) {
            tvNome.setText(msg.nome != null ? msg.nome : "--");
            tvConteudo.setText(msg.conteudo);
            tvHora.setText(DateUtils.formatTimeOnly(msg.criadoEm));

            // Avatar com inicial e cor do perfil
            String inicial = (msg.nome != null && !msg.nome.isEmpty())
                    ? String.valueOf(msg.nome.charAt(0)).toUpperCase() : "?";
            tvAvatar.setText(inicial);

            int cor = ColorUtils.getColorForPerfil(msg.perfil);
            GradientDrawable bg = new GradientDrawable();
            bg.setShape(GradientDrawable.OVAL);
            bg.setColor(ColorUtils.withAlpha(cor, 0.20f));
            tvAvatar.setBackground(bg);
            tvAvatar.setTextColor(cor);
        }
    }
}
