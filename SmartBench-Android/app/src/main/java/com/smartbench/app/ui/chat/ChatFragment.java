package com.smartbench.app.ui.chat;

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
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.databinding.FragmentChatBinding;

public class ChatFragment extends Fragment {

    private FragmentChatBinding binding;
    private ChatViewModel viewModel;
    private ChatAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentChatBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(ChatViewModel.class);

        String meuNome = SessionManager.getInstance(requireContext()).getUserNome();

        adapter = new ChatAdapter();
        LinearLayoutManager layoutManager = new LinearLayoutManager(requireContext());
        layoutManager.setStackFromEnd(true); // novas mensagens no final
        binding.rvMensagens.setLayoutManager(layoutManager);
        binding.rvMensagens.setAdapter(adapter);

        // Botão voltar
        binding.btnVoltar.setOnClickListener(v -> {
            if (getActivity() != null) getActivity().onBackPressed();
        });

        // Botão enviar
        binding.btnEnviar.setOnClickListener(v -> {
            String texto = binding.etMensagem.getText() != null
                    ? binding.etMensagem.getText().toString().trim() : "";
            if (texto.isEmpty()) return;
            binding.etMensagem.setText("");
            viewModel.enviar(texto);
        });

        // Observers
        viewModel.status.observe(getViewLifecycleOwner(), status -> {
            if (!status.chatAtivo) {
                binding.layoutDesativado.setVisibility(View.VISIBLE);
                binding.layoutInput.setVisibility(View.GONE);
            } else {
                binding.layoutDesativado.setVisibility(View.GONE);
                binding.layoutInput.setVisibility(View.VISIBLE);
            }
        });

        viewModel.mensagens.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                adapter.setData(resource.data, meuNome);
                binding.rvMensagens.scrollToPosition(adapter.getItemCount() - 1);
                binding.progressBar.setVisibility(View.GONE);
            } else if (resource.status == Resource.Status.ERROR) {
                binding.progressBar.setVisibility(View.GONE);
            }
        });

        viewModel.envioResult.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS) {
                viewModel.recarregar();
            } else if (resource.status == Resource.Status.ERROR) {
                Toast.makeText(requireContext(), resource.message, Toast.LENGTH_SHORT).show();
            }
        });

        viewModel.iniciar();
    }

    @Override
    public void onPause() {
        super.onPause();
        viewModel.pararPolling();
    }

    @Override
    public void onResume() {
        super.onResume();
        viewModel.recarregar();
        viewModel.retomarPolling();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
