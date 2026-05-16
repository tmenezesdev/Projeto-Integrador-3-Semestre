package com.smartbench.app.ui.supervisor.historico;

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
import com.smartbench.app.databinding.FragmentSupervisorHistoricoBinding;
import com.smartbench.app.ui.common.adapters.TransacoesAdapter;
import com.smartbench.app.utils.ExcelExporter;

import java.io.IOException;
import java.util.List;

public class SupervisorHistoricoFragment extends Fragment {

    private static final int PAGE_SIZE = 20;
    private FragmentSupervisorHistoricoBinding binding;
    private SupervisorHistoricoViewModel viewModel;
    private TransacoesAdapter adapter;
    private List<Transacao> listaCompleta;
    private int paginaAtual = 0;
    private String filtroTipo = null;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentSupervisorHistoricoBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(SupervisorHistoricoViewModel.class);

        adapter = new TransacoesAdapter();
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        binding.etBusca.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int i, int i1, int i2) {}
            @Override public void onTextChanged(CharSequence s, int i, int i1, int i2) {
                adapter.filter(s.toString()); paginaAtual = 0;
            }
            @Override public void afterTextChanged(Editable s) {}
        });

        binding.chipTodos.setOnClickListener(v -> { filtroTipo = null; adapter.filterByTipo(null); });
        binding.chipRetiradas.setOnClickListener(v -> { filtroTipo = "RETIRADA"; adapter.filterByTipo("RETIRADA"); });
        binding.chipDevolucoes.setOnClickListener(v -> { filtroTipo = "DEVOLUCAO"; adapter.filterByTipo("DEVOLUCAO"); });

        binding.btnExportar.setOnClickListener(v -> {
            if (adapter.getListaFull() != null && !adapter.getListaFull().isEmpty()) {
                try {
                    ExcelExporter.exportarECompartilhar(requireContext(), adapter.getListaFull());
                } catch (IOException e) {
                    Toast.makeText(requireContext(), "Erro ao exportar: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            } else {
                Toast.makeText(requireContext(), "Nenhum dado para exportar", Toast.LENGTH_SHORT).show();
            }
        });

        binding.btnAnterior.setOnClickListener(v -> { if (paginaAtual > 0) { paginaAtual--; renderPagina(); } });
        binding.btnProximo.setOnClickListener(v -> {
            if (listaCompleta != null && (paginaAtual + 1) * PAGE_SIZE < listaCompleta.size()) {
                paginaAtual++; renderPagina();
            }
        });

        viewModel.historico.observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING: binding.progressBar.setVisibility(View.VISIBLE); break;
                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    listaCompleta = resource.data;
                    paginaAtual = 0;
                    adapter.setData(listaCompleta != null ? listaCompleta : new java.util.ArrayList<>());
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
        if (listaCompleta == null || listaCompleta.isEmpty()) return;
        int total = listaCompleta.size();
        int totalPaginas = (int) Math.ceil((double) total / PAGE_SIZE);
        binding.tvPagina.setText("Pág " + (paginaAtual + 1) + " / " + totalPaginas);
        binding.btnAnterior.setEnabled(paginaAtual > 0);
        binding.btnProximo.setEnabled(paginaAtual < totalPaginas - 1);
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
