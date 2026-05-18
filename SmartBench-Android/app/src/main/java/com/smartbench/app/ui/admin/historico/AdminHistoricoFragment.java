package com.smartbench.app.ui.admin.historico;

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
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.databinding.FragmentListSearchBinding;
import com.smartbench.app.ui.common.adapters.TransacoesAdapter;

import java.util.ArrayList;
import java.util.List;

public class AdminHistoricoFragment extends Fragment {

    private static final int PAGE_SIZE = 20;

    private FragmentListSearchBinding binding;
    private AdminHistoricoViewModel viewModel;
    private TransacoesAdapter adapter;
    private List<Transacao> listaFiltrada = new ArrayList<>();
    private int paginaAtual = 0;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentListSearchBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(AdminHistoricoViewModel.class);

        binding.tvTitle.setText("Histórico");
        binding.btnAction.setVisibility(View.GONE);
        binding.layoutPaginacao.setVisibility(View.VISIBLE);

        adapter = new TransacoesAdapter();
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        binding.etBusca.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int i, int i1, int i2) {}
            @Override public void onTextChanged(CharSequence s, int i, int i1, int i2) {
                filtrarEAtualizar(s.toString());
            }
            @Override public void afterTextChanged(Editable s) {}
        });

        binding.btnAnterior.setOnClickListener(v -> {
            if (paginaAtual > 0) {
                paginaAtual--;
                renderPagina();
            }
        });

        binding.btnProximo.setOnClickListener(v -> {
            if ((paginaAtual + 1) * PAGE_SIZE < listaFiltrada.size()) {
                paginaAtual++;
                renderPagina();
            }
        });

        viewModel.historico.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.LOADING) {
                binding.progressBar.setVisibility(View.VISIBLE);
            } else if (resource.status == Resource.Status.SUCCESS) {
                binding.progressBar.setVisibility(View.GONE);
                listaFiltrada = resource.data != null ? new ArrayList<>(resource.data) : new ArrayList<>();
                paginaAtual = 0;
                renderPagina();
            } else {
                binding.progressBar.setVisibility(View.GONE);
                Toast.makeText(requireContext(), resource.message, Toast.LENGTH_SHORT).show();
            }
        });

        viewModel.carregar();
    }

    private void filtrarEAtualizar(String query) {
        List<Transacao> full = viewModel.historico.getValue() != null
                && viewModel.historico.getValue().data != null
                ? viewModel.historico.getValue().data
                : new ArrayList<>();

        if (query == null || query.isEmpty()) {
            listaFiltrada = new ArrayList<>(full);
        } else {
            String q = query.toLowerCase();
            listaFiltrada = new ArrayList<>();
            for (Transacao t : full) {
                if ((t.ferramenta != null && t.ferramenta.toLowerCase().contains(q))
                        || (t.responsavel != null && t.responsavel.toLowerCase().contains(q))
                        || (t.tagRfid != null && t.tagRfid.toLowerCase().contains(q))) {
                    listaFiltrada.add(t);
                }
            }
        }
        paginaAtual = 0;
        renderPagina();
    }

    private void renderPagina() {
        if (binding == null) return;

        if (listaFiltrada.isEmpty()) {
            binding.layoutVazio.setVisibility(View.VISIBLE);
            adapter.setData(new ArrayList<>());
            binding.tvPagina.setText("Pág 0 / 0");
            binding.btnAnterior.setEnabled(false);
            binding.btnProximo.setEnabled(false);
            return;
        }

        binding.layoutVazio.setVisibility(View.GONE);
        int start = paginaAtual * PAGE_SIZE;
        int end = Math.min(start + PAGE_SIZE, listaFiltrada.size());
        adapter.setData(listaFiltrada.subList(start, end));

        int totalPaginas = (int) Math.ceil((double) listaFiltrada.size() / PAGE_SIZE);
        binding.tvPagina.setText("Pág " + (paginaAtual + 1) + " / " + totalPaginas);
        binding.btnAnterior.setEnabled(paginaAtual > 0);
        binding.btnProximo.setEnabled(paginaAtual < totalPaginas - 1);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
