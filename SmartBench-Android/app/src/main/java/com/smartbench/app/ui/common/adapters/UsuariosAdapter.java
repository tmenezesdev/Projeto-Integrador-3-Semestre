package com.smartbench.app.ui.common.adapters;

import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.databinding.ItemUsuarioBinding;
import com.smartbench.app.utils.ColorUtils;

import java.util.ArrayList;
import java.util.List;

public class UsuariosAdapter extends RecyclerView.Adapter<UsuariosAdapter.VH> {

    public interface OnItemAction {
        void onEditar(Usuario u);
        void onDeletar(Usuario u);
    }

    private List<Usuario> lista = new ArrayList<>();
    private List<Usuario> listaFull = new ArrayList<>();
    private final OnItemAction listener;
    private final boolean showActions;

    public UsuariosAdapter(OnItemAction listener, boolean showActions) {
        this.listener = listener;
        this.showActions = showActions;
    }

    public void setData(List<Usuario> data) {
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
            for (Usuario u : listaFull) {
                if ((u.nome != null && u.nome.toLowerCase().contains(q))
                        || (u.email != null && u.email.toLowerCase().contains(q))
                        || (u.tagCracha != null && u.tagCracha.toLowerCase().contains(q))) {
                    lista.add(u);
                }
            }
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemUsuarioBinding binding = ItemUsuarioBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new VH(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        holder.bind(lista.get(position));
    }

    @Override
    public int getItemCount() { return lista.size(); }

    class VH extends RecyclerView.ViewHolder {
        final ItemUsuarioBinding b;

        VH(ItemUsuarioBinding binding) {
            super(binding.getRoot());
            b = binding;
        }

        void bind(Usuario u) {
            b.tvNome.setText(u.nome != null ? u.nome : "--");
            b.tvEmail.setText(u.email != null ? u.email : "--");
            b.tvTag.setText(u.tagCracha != null ? u.tagCracha : "--");

            // Avatar com cor do perfil
            int cor = ColorUtils.getColorForPerfil(u.tipoPerfil);
            GradientDrawable bg = new GradientDrawable();
            bg.setShape(GradientDrawable.OVAL);
            bg.setColor(ColorUtils.withAlpha(cor, 0.20f));
            b.tvAvatar.setBackground(bg);
            b.tvAvatar.setTextColor(cor);
            b.tvAvatar.setText(u.getNomeInicial());

            // Badge perfil
            String labelPerfil = u.tipoPerfil != null ? u.tipoPerfil : "--";
            b.tvPerfil.setText(labelPerfil);
            GradientDrawable badgeBg = new GradientDrawable();
            badgeBg.setShape(GradientDrawable.RECTANGLE);
            badgeBg.setCornerRadius(50f);
            badgeBg.setColor(ColorUtils.withAlpha(cor, 0.15f));
            b.tvPerfil.setBackground(badgeBg);
            b.tvPerfil.setTextColor(cor);

            // Ações
            if (showActions) {
                b.btnEditar.setVisibility(View.VISIBLE);
                b.btnDeletar.setVisibility(View.VISIBLE);
                b.btnEditar.setOnClickListener(v -> listener.onEditar(u));
                b.btnDeletar.setOnClickListener(v -> listener.onDeletar(u));
            } else {
                b.btnEditar.setVisibility(View.GONE);
                b.btnDeletar.setVisibility(View.GONE);
            }
        }
    }
}
