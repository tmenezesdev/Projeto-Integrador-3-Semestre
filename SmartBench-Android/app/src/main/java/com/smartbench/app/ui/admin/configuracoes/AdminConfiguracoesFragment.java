package com.smartbench.app.ui.admin.configuracoes;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.smartbench.app.data.model.entity.ConfiguracaoSistema;
import com.smartbench.app.databinding.FragmentAdminConfiguracoesBinding;

public class AdminConfiguracoesFragment extends Fragment {

    private FragmentAdminConfiguracoesBinding binding;
    private AdminConfiguracoesViewModel viewModel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentAdminConfiguracoesBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(AdminConfiguracoesViewModel.class);

        viewModel.config.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == com.smartbench.app.data.model.response.Resource.Status.SUCCESS && resource.data != null) {
                ConfiguracaoSistema c = resource.data;
                binding.etTempoLimite.setText(String.valueOf(c.tempoLimiteHoras));
                binding.etTempoAviso.setText(String.valueOf(c.tempoAvisoMinutos));
                binding.switchManutencao.setChecked(c.modoManutencao);
                binding.switchChat.setChecked(c.chatAtivo);
            }
        });

        viewModel.salvarResult.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == com.smartbench.app.data.model.response.Resource.Status.SUCCESS) {
                Toast.makeText(requireContext(), "Configurações salvas!", Toast.LENGTH_SHORT).show();
            } else if (resource.status == com.smartbench.app.data.model.response.Resource.Status.ERROR) {
                Toast.makeText(requireContext(), resource.message, Toast.LENGTH_SHORT).show();
            }
        });

        binding.btnSalvar.setOnClickListener(v -> {
            String limiteStr = binding.etTempoLimite.getText() != null ? binding.etTempoLimite.getText().toString() : "4";
            String avisoStr = binding.etTempoAviso.getText() != null ? binding.etTempoAviso.getText().toString() : "30";

            ConfiguracaoSistema config = new ConfiguracaoSistema();
            try { config.tempoLimiteHoras = Integer.parseInt(limiteStr); } catch (NumberFormatException e) { config.tempoLimiteHoras = 4; }
            try { config.tempoAvisoMinutos = Integer.parseInt(avisoStr); } catch (NumberFormatException e) { config.tempoAvisoMinutos = 30; }
            config.modoManutencao = binding.switchManutencao.isChecked();
            config.chatAtivo = binding.switchChat.isChecked();

            viewModel.salvar(config);
        });

        viewModel.carregar();
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
