package com.smartbench.app.ui.common.adapters;

import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.databinding.ItemAlertaBinding;
import com.smartbench.app.utils.ColorUtils;
import com.smartbench.app.utils.DateUtils;

import java.util.ArrayList;
import java.util.List;

public class AlertasAdapter extends RecyclerView.Adapter<AlertasAdapter.VH> {

    public interface OnResolver {
        void onResolver(Alerta a);
    }

    private List<Alerta> lista = new ArrayList<>();
    private List<Alerta> listaFull = new ArrayList<>();
    private final OnResolver listener;
    private final boolean showResolver;

    public AlertasAdapter(OnResolver listener, boolean showResolver) {
        this.listener = listener;
        this.showResolver = showResolver;
    }

    public void setData(List<Alerta> data) {
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
            for (Alerta a : listaFull) {
                if ((a.ferramenta != null && a.ferramenta.toLowerCase().contains(q))
                        || (a.mensagem != null && a.mensagem.toLowerCase().contains(q))
                        || (a.responsavel != null && a.responsavel.toLowerCase().contains(q))) {
                    lista.add(a);
                }
            }
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemAlertaBinding binding = ItemAlertaBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new VH(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        holder.bind(lista.get(position));
    }

    @Override
    public int getItemCount() { return lista.size(); }

    class VH extends RecyclerView.ViewHolder {
        final ItemAlertaBinding b;

        VH(ItemAlertaBinding binding) {
            super(binding.getRoot());
            b = binding;
        }

        void bind(Alerta a) {
            b.tvFerramenta.setText(a.ferramenta != null ? a.ferramenta : "Sistema");
            b.tvTag.setText(a.tagRfid != null ? a.tagRfid : "");
            b.tvMensagem.setText(a.mensagem != null ? a.mensagem : "--");
            b.tvData.setText(DateUtils.formatDisplay(a.dataGeracao));

            int cor = ColorUtils.getColorForAlertaStatus(a.statusAlerta);
            b.tvStatus.setText(a.statusAlerta != null ? a.statusAlerta : "--");
            GradientDrawable bg = new GradientDrawable();
            bg.setShape(GradientDrawable.RECTANGLE);
            bg.setCornerRadius(50f);
            bg.setColor(ColorUtils.withAlpha(cor, 0.15f));
            b.tvStatus.setBackground(bg);
            b.tvStatus.setTextColor(cor);

            if (showResolver && "ATIVO".equals(a.statusAlerta)) {
                b.btnResolver.setVisibility(View.VISIBLE);
                b.btnResolver.setOnClickListener(v -> listener.onResolver(a));
            } else {
                b.btnResolver.setVisibility(View.GONE);
            }
        }
    }
}
