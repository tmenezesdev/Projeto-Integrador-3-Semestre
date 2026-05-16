package com.smartbench.app.ui.mecanico.historico;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.databinding.FragmentListSearchBinding;
import com.smartbench.app.ui.common.adapters.TransacoesAdapter;

import java.util.List;

public class MecanicoHistoricoFragment extends Fragment {

    private static final int PAGE_SIZE = 20;
    private FragmentListSearchBinding binding;
    private MecanicoHistoricoViewModel viewModel;
    private List<Transacao> listaCompleta;
    private int paginaAtual = 0;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentListSearchBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(MecanicoHistoricoViewModel.class);

        binding.tvTitle.setText("Meu Histórico");
        binding.btnAction.setVisibility(View.GONE);
        binding.layoutPaginacao.setVisibility(View.VISIBLE);

        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        binding.etBusca.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int i, int i1, int i2) {}
            @Override public void onTextChanged(CharSequence s, int i, int i1, int i2) { paginaAtual = 0; }
            @Override public void afterTextChanged(Editable s) {}
        });

        binding.btnAnterior.setOnClickListener(v -> { if (paginaAtual > 0) { paginaAtual--; renderPagina(); } });
        binding.btnProximo.setOnClickListener(v -> {
            if (listaCompleta != null && (paginaAtual + 1) * PAGE_SIZE < listaCompleta.size()) { paginaAtual++; renderPagina(); }
        });

        viewModel.historico.observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING: binding.progressBar.setVisibility(View.VISIBLE); break;
                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    listaCompleta = resource.data;
                    paginaAtual = 0;
                    renderPagina();
                    break;
                case ERROR:
                    binding.progressBar.setVisibility(View.GONE);
                    Toast.makeText(requireContext(), resource.message, Toast.LENGTH_SHORT).show();
                    break;
            }
        });

        viewModel.carregar();
    }

    private void renderPagina() {
        if (listaCompleta == null || listaCompleta.isEmpty()) {
            binding.layoutVazio.setVisibility(View.VISIBLE);
            return;
        }
        binding.layoutVazio.setVisibility(View.GONE);
        int start = paginaAtual * PAGE_SIZE;
        int end = Math.min(start + PAGE_SIZE, listaCompleta.size());
        TransacoesAdapter pageAdapter = new TransacoesAdapter();
        pageAdapter.setData(listaCompleta.subList(start, end));
        binding.recyclerView.setAdapter(pageAdapter);

        int total = (int) Math.ceil((double) listaCompleta.size() / PAGE_SIZE);
        binding.tvPagina.setText("Pág " + (paginaAtual + 1) + " / " + total);
        binding.btnAnterior.setEnabled(paginaAtual > 0);
        binding.btnProximo.setEnabled(paginaAtual < total - 1);
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
