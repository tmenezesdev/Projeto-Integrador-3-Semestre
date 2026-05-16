package com.smartbench.app.ui.common.adapters;

import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.databinding.ItemTransacaoBinding;
import com.smartbench.app.utils.ColorUtils;
import com.smartbench.app.utils.DateUtils;

import java.util.ArrayList;
import java.util.List;

public class TransacoesAdapter extends RecyclerView.Adapter<TransacoesAdapter.VH> {

    private List<Transacao> lista = new ArrayList<>();
    private List<Transacao> listaFull = new ArrayList<>();

    public void setData(List<Transacao> data) {
        listaFull = new ArrayList<>(data);
        lista = new ArrayList<>(data);
        notifyDataSetChanged();
    }

    public void filter(String query) {
        if (query == null || query.isEmpty()) {
            lista = new ArrayList<>(listaFull);
        } else {
            String q = query.toLowerCase();
            lista = new ArrayList<>();
            for (Transacao t : listaFull) {
                if ((t.ferramenta != null && t.ferramenta.toLowerCase().contains(q))
                        || (t.tagRfid != null && t.tagRfid.toLowerCase().contains(q))
                        || (t.responsavel != null && t.responsavel.toLowerCase().contains(q))) {
                    lista.add(t);
                }
            }
        }
        notifyDataSetChanged();
    }

    public void filterByTipo(String tipo) {
        if (tipo == null || tipo.isEmpty()) {
            lista = new ArrayList<>(listaFull);
        } else {
            lista = new ArrayList<>();
            for (Transacao t : listaFull) {
                if (tipo.equals(t.tipo)) lista.add(t);
            }
        }
        notifyDataSetChanged();
    }

    public List<Transacao> getListaFull() { return listaFull; }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemTransacaoBinding binding = ItemTransacaoBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new VH(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        holder.bind(lista.get(position));
    }

    @Override
    public int getItemCount() { return lista.size(); }

    static class VH extends RecyclerView.ViewHolder {
        final ItemTransacaoBinding b;

        VH(ItemTransacaoBinding binding) {
            super(binding.getRoot());
            b = binding;
        }

        void bind(Transacao t) {
            b.tvFerramenta.setText(t.ferramenta != null ? t.ferramenta : "--");
            b.tvResponsavel.setText(t.responsavel != null ? t.responsavel : "--");
            b.tvData.setText(DateUtils.formatDisplay(t.dataHora));

            int corOp = ColorUtils.getColorForOperacao(t.tipo);
            b.viewIndicador.setBackgroundColor(corOp);

            b.tvOperacao.setText(t.tipo != null ? t.tipo : "--");
            GradientDrawable bgOp = new GradientDrawable();
            bgOp.setShape(GradientDrawable.RECTANGLE);
            bgOp.setCornerRadius(50f);
            bgOp.setColor(ColorUtils.withAlpha(corOp, 0.15f));
            b.tvOperacao.setBackground(bgOp);
            b.tvOperacao.setTextColor(corOp);

            // Método badge
            int corMet = "RFID_AUTOMATICO".equals(t.metodo)
                    ? 0xFF22C55E : 0xFFF59E0B;
            String labelMet = "RFID_AUTOMATICO".equals(t.metodo) ? "RFID AUTO" : "MANUAL";
            b.tvMetodo.setText(labelMet);
            GradientDrawable bgMet = new GradientDrawable();
            bgMet.setShape(GradientDrawable.RECTANGLE);
            bgMet.setCornerRadius(50f);
            bgMet.setColor(ColorUtils.withAlpha(corMet, 0.15f));
            b.tvMetodo.setBackground(bgMet);
            b.tvMetodo.setTextColor(corMet);
        }
    }
}
