package com.smartbench.app.ui.common.adapters;

import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.databinding.ItemFerramentaBinding;
import com.smartbench.app.utils.ColorUtils;

import java.util.ArrayList;
import java.util.List;

public class FerramentasAdapter extends RecyclerView.Adapter<FerramentasAdapter.VH> {

    public interface OnItemAction {
        void onEditar(Ferramenta f);
        void onDeletar(Ferramenta f);
        void onClick(Ferramenta f);
    }

    private List<Ferramenta> lista = new ArrayList<>();
    private List<Ferramenta> listaFull = new ArrayList<>();
    private final OnItemAction listener;
    private final boolean showCrud;

    public FerramentasAdapter(OnItemAction listener, boolean showCrud) {
        this.listener = listener;
        this.showCrud = showCrud;
    }

    public void setData(List<Ferramenta> data) {
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
            for (Ferramenta f : listaFull) {
                if ((f.nome != null && f.nome.toLowerCase().contains(q))
                        || (f.tagRfid != null && f.tagRfid.toLowerCase().contains(q))) {
                    lista.add(f);
                }
            }
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemFerramentaBinding binding = ItemFerramentaBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new VH(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        holder.bind(lista.get(position));
    }

    @Override
    public int getItemCount() { return lista.size(); }

    class VH extends RecyclerView.ViewHolder {
        final ItemFerramentaBinding b;

        VH(ItemFerramentaBinding binding) {
            super(binding.getRoot());
            b = binding;
        }

        void bind(Ferramenta f) {
            b.tvNome.setText(f.nome != null ? f.nome : "--");
            b.tvTag.setText(f.getTagRfid() != null ? f.getTagRfid() : "--");
            b.tvPeso.setText(f.pesoReferencia != null ? f.pesoReferencia + " g" : "--");

            int cor = ColorUtils.getColorForStatus(f.status);
            b.tvStatus.setText(f.status != null ? f.status : "--");
            GradientDrawable bg = new GradientDrawable();
            bg.setShape(GradientDrawable.RECTANGLE);
            bg.setCornerRadius(50f);
            bg.setColor(ColorUtils.withAlpha(cor, 0.15f));
            b.tvStatus.setBackground(bg);
            b.tvStatus.setTextColor(cor);

            b.getRoot().setOnClickListener(v -> listener.onClick(f));

            if (showCrud) {
                b.btnEditar.setVisibility(View.VISIBLE);
                b.btnDeletar.setVisibility(View.VISIBLE);
                b.btnEditar.setOnClickListener(v -> listener.onEditar(f));
                b.btnDeletar.setOnClickListener(v -> listener.onDeletar(f));
            }
        }
    }
}
