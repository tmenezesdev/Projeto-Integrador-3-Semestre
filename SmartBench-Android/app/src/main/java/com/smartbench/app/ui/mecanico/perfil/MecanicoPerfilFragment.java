package com.smartbench.app.ui.mecanico.perfil;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.smartbench.app.R;
import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.databinding.FragmentAdminPerfilBinding;
import com.smartbench.app.ui.mecanico.MecanicoHostActivity;
import com.smartbench.app.utils.DateUtils;

public class MecanicoPerfilFragment extends Fragment {

    private FragmentAdminPerfilBinding binding;
    private MecanicoPerfilViewModel viewModel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentAdminPerfilBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(MecanicoPerfilViewModel.class);

        // Ocultar botões de Histórico e Configurações que são específicos do Admin
        binding.btnHistorico.setVisibility(View.GONE);
        binding.btnConfiguracoes.setVisibility(View.GONE);

        binding.btnLogout.setOnClickListener(v -> {
            if (getActivity() instanceof MecanicoHostActivity) {
                ((MecanicoHostActivity) getActivity()).logout();
            }
        });

        binding.btnAlterarSenha.setOnClickListener(v -> {
            String atual = binding.etSenhaAtual.getText() != null ? binding.etSenhaAtual.getText().toString() : "";
            String nova = binding.etNovaSenha.getText() != null ? binding.etNovaSenha.getText().toString() : "";
            if (atual.isEmpty() || nova.length() < 6) {
                Toast.makeText(requireContext(), "Informe a senha atual e mínimo 6 caracteres", Toast.LENGTH_SHORT).show();
                return;
            }
            viewModel.alterarSenha(atual, nova);
        });

        viewModel.perfil.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == com.smartbench.app.data.model.response.Resource.Status.SUCCESS && resource.data != null) {
                Usuario u = resource.data;
                binding.tvNome.setText(u.nome != null ? u.nome : "--");
                binding.tvEmail.setText(u.email != null ? u.email : "--");
                binding.tvPerfil.setText("Mecânico");
                binding.tvMembro.setText("Membro desde: " + DateUtils.formatDateOnly(u.dataCriacao));
                if (u.fotoUrl != null && !u.fotoUrl.isEmpty()) {
                    Glide.with(this).load(u.fotoUrl).circleCrop().into(binding.ivAvatar);
                }
            }
        });

        viewModel.senhaResult.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == com.smartbench.app.data.model.response.Resource.Status.SUCCESS) {
                Toast.makeText(requireContext(), "Senha alterada!", Toast.LENGTH_SHORT).show();
                binding.etSenhaAtual.setText("");
                binding.etNovaSenha.setText("");
            } else if (resource.status == com.smartbench.app.data.model.response.Resource.Status.ERROR) {
                Toast.makeText(requireContext(), resource.message, Toast.LENGTH_LONG).show();
            }
        });

        viewModel.carregar();
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
