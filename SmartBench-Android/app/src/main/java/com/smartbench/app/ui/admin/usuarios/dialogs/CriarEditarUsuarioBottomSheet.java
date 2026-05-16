package com.smartbench.app.ui.admin.usuarios.dialogs;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.smartbench.app.R;
import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.databinding.BottomsheetCriarUsuarioBinding;

public class CriarEditarUsuarioBottomSheet extends BottomSheetDialogFragment {

    private BottomsheetCriarUsuarioBinding binding;
    private Usuario usuarioEdicao;
    private OnSaveListener listener;

    public interface OnSaveListener {
        void onSave(Usuario u);
    }

    public static CriarEditarUsuarioBottomSheet newInstance(@Nullable Usuario usuario) {
        CriarEditarUsuarioBottomSheet sheet = new CriarEditarUsuarioBottomSheet();
        sheet.usuarioEdicao = usuario;
        return sheet;
    }

    public void setOnSave(OnSaveListener l) { this.listener = l; }

    @Override
    public int getTheme() { return R.style.SmartBench_BottomSheetDialog; }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = BottomsheetCriarUsuarioBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Dropdown de perfil
        String[] perfis = {"MECANICO", "SUPERVISOR", "ADMIN"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_dropdown_item_1line, perfis);
        binding.spinnerPerfil.setAdapter(adapter);

        boolean isEdicao = usuarioEdicao != null;
        binding.tvTitulo.setText(isEdicao ? "Editar Usuário" : "Novo Usuário");
        binding.tilSenha.setHint(isEdicao ? "Nova senha (opcional)" : "Senha");

        if (isEdicao) {
            binding.etNome.setText(usuarioEdicao.nome);
            binding.etEmail.setText(usuarioEdicao.email);
            binding.etTag.setText(usuarioEdicao.tagCracha);
            for (int i = 0; i < perfis.length; i++) {
                if (perfis[i].equals(usuarioEdicao.tipoPerfil)) {
                    binding.spinnerPerfil.setSelection(i);
                    break;
                }
            }
        }

        binding.btnCancelar.setOnClickListener(v -> dismiss());

        binding.btnSalvar.setOnClickListener(v -> {
            String nome = binding.etNome.getText() != null ? binding.etNome.getText().toString().trim() : "";
            String email = binding.etEmail.getText() != null ? binding.etEmail.getText().toString().trim() : "";
            String tag = binding.etTag.getText() != null ? binding.etTag.getText().toString().trim() : "";
            String perfil = binding.spinnerPerfil.getSelectedItem() != null ? binding.spinnerPerfil.getSelectedItem().toString() : "MECANICO";
            String senha = binding.etSenha.getText() != null ? binding.etSenha.getText().toString() : "";

            if (nome.isEmpty()) { binding.tilNome.setError("Obrigatório"); return; }
            if (email.isEmpty()) { binding.tilEmail.setError("Obrigatório"); return; }
            if (tag.isEmpty()) { binding.tilTag.setError("Obrigatório"); return; }
            if (!isEdicao && senha.length() < 6) { binding.tilSenha.setError("Mínimo 6 caracteres"); return; }

            binding.tilNome.setError(null);
            binding.tilEmail.setError(null);
            binding.tilTag.setError(null);
            binding.tilSenha.setError(null);

            Usuario u = new Usuario();
            u.nome = nome;
            u.email = email;
            u.tagCracha = tag.toUpperCase();
            u.tipoPerfil = perfil;
            if (!senha.isEmpty()) u.senha = senha;

            if (listener != null) listener.onSave(u);
            dismiss();
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
