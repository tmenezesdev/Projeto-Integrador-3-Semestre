package com.smartbench.app.ui.supervisor.atrasos;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.smartbench.app.data.local.SessionManager;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.request.DevolucaoRequest;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.databinding.FragmentSupervisorAtrasosBinding;
import com.smartbench.app.ui.supervisor.atrasos.dialogs.DevolucaoBottomSheet;
import com.smartbench.app.ui.common.adapters.FerramentasAdapter;

import java.util.ArrayList;
import java.util.List;

public class SupervisorAtrasosFragment extends Fragment {

    private FragmentSupervisorAtrasosBinding binding;
    private SupervisorAtrasosViewModel viewModel;
    private FerramentasAdapter adapter;
    private List<Ferramenta> listaCompleta = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentSupervisorAtrasosBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(SupervisorAtrasosViewModel.class);

        adapter = new FerramentasAdapter(new FerramentasAdapter.OnItemAction() {
            @Override public void onEditar(Ferramenta f) {}
            @Override public void onDeletar(Ferramenta f) {}
            @Override public void onClick(Ferramenta f) { abrirDevolucao(f); }
        }, false);

        binding.rvAtrasos.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.rvAtrasos.setAdapter(adapter);

        // Filtros por nível
        binding.chipTodos.setOnClickListener(v -> filtrar(null));
        binding.chipCritico.setOnClickListener(v -> filtrar("CRITICO"));
        binding.chipAlto.setOnClickListener(v -> filtrar("ALTO"));
        binding.chipModerado.setOnClickListener(v -> filtrar("MODERADO"));

        binding.btnAtualizar.setOnClickListener(v -> viewModel.carregar());

        viewModel.ferramentasFora.observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING: binding.progressBar.setVisibility(View.VISIBLE); break;
                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    listaCompleta = resource.data != null ? resource.data : new ArrayList<>();
                    populateKpis();
                    filtrar(null);
                    break;
                case ERROR:
                    binding.progressBar.setVisibility(View.GONE);
                    Toast.makeText(requireContext(), resource.message, Toast.LENGTH_SHORT).show();
                    break;
            }
        });

        viewModel.devolucaoResult.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS) {
                Toast.makeText(requireContext(), "Devolução registrada!", Toast.LENGTH_SHORT).show();
                viewModel.carregar();
            } else if (resource.status == Resource.Status.ERROR) {
                Toast.makeText(requireContext(), resource.message, Toast.LENGTH_LONG).show();
            }
        });

        viewModel.carregar();
    }

    private void populateKpis() {
        int total = listaCompleta.size(), critico = 0, alto = 0, moderado = 0;
        for (Ferramenta f : listaCompleta) {
            String nivel = f.getNivelAtraso();
            if ("CRITICO".equals(nivel)) critico++;
            else if ("ALTO".equals(nivel)) alto++;
            else moderado++;
        }
        binding.tvTotal.setText(String.valueOf(total));
        binding.tvCritico.setText(String.valueOf(critico));
        binding.tvAlto.setText(String.valueOf(alto));
        binding.tvModerado.setText(String.valueOf(moderado));
    }

    private void filtrar(String nivel) {
        if (nivel == null) { adapter.setData(listaCompleta); return; }
        List<Ferramenta> filtrada = new ArrayList<>();
        for (Ferramenta f : listaCompleta) { if (nivel.equals(f.getNivelAtraso())) filtrada.add(f); }
        adapter.setData(filtrada);
    }

    private void abrirDevolucao(Ferramenta f) {
        DevolucaoBottomSheet sheet = DevolucaoBottomSheet.newInstance(f);
        sheet.setOnConfirmar(obs -> {
            int supervisorId = SessionManager.getInstance(requireContext()).getUserId();
            viewModel.devolver(new DevolucaoRequest(f.id, supervisorId, obs));
        });
        sheet.show(getChildFragmentManager(), "devolucao");
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
