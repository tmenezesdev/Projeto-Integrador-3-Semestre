package com.smartbench.app.ui.supervisor.cadastro;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.smartbench.app.data.model.request.CriarFuncionarioRequest;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.databinding.FragmentSupervisorCadastroBinding;
import com.smartbench.app.utils.ValidationUtils;

public class SupervisorCadastroFragment extends Fragment {

    private FragmentSupervisorCadastroBinding binding;
    private SupervisorCadastroViewModel viewModel;
    private boolean emailAutoFill = true;
    private boolean tagAutoFill = true;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentSupervisorCadastroBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(SupervisorCadastroViewModel.class);

        // Spinner perfil
        String[] perfis = {"MECANICO", "SUPERVISOR"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_dropdown_item_1line, perfis);
        binding.spinnerPerfil.setAdapter(adapter);

        // Auto-fill email e tag quando nome muda
        binding.etNome.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int i, int i1, int i2) {}
            @Override public void onTextChanged(CharSequence s, int i, int i1, int i2) {
                if (emailAutoFill) binding.etEmail.setText(ValidationUtils.autoFillEmail(s.toString()));
                if (tagAutoFill) {
                    String perfil = binding.spinnerPerfil.getSelectedItem() != null ? binding.spinnerPerfil.getSelectedItem().toString() : "MECANICO";
                    binding.etTag.setText(ValidationUtils.autoGenerateTag(perfil, System.currentTimeMillis()));
                }
            }
            @Override public void afterTextChanged(Editable s) {}
        });

        // Detectar edição manual de email
        binding.etEmail.setOnFocusChangeListener((v2, hasFocus) -> { if (hasFocus) emailAutoFill = false; });
        binding.etTag.setOnFocusChangeListener((v2, hasFocus) -> { if (hasFocus) tagAutoFill = false; });

        binding.btnCadastrar.setOnClickListener(v -> {
            String nome = binding.etNome.getText() != null ? binding.etNome.getText().toString().trim() : "";
            String email = binding.etEmail.getText() != null ? binding.etEmail.getText().toString().trim() : "";
            String tag = binding.etTag.getText() != null ? binding.etTag.getText().toString().trim().toUpperCase() : "";
            String perfil = binding.spinnerPerfil.getSelectedItem() != null ? binding.spinnerPerfil.getSelectedItem().toString() : "MECANICO";

            if (nome.isEmpty()) { binding.tilNome.setError("Obrigatório"); return; }
            if (!ValidationUtils.isEmailValid(email)) { binding.tilEmail.setError("E-mail inválido"); return; }
            if (tag.isEmpty()) { binding.tilTag.setError("Obrigatório"); return; }

            viewModel.cadastrar(new CriarFuncionarioRequest(nome, email, tag, perfil));
        });

        viewModel.cadastroResult.observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING:
                    binding.btnCadastrar.setEnabled(false);
                    break;
                case SUCCESS:
                    binding.btnCadastrar.setEnabled(true);
                    String senhaTemp = "--";
                    if (resource.data != null && resource.data.containsKey("senhaTemporaria")) {
                        Object s = resource.data.get("senhaTemporaria");
                        if (s != null) senhaTemp = s.toString();
                    }
                    binding.layoutSenha.setVisibility(View.VISIBLE);
                    binding.tvSenhaTemp.setText("Senha temporária: " + senhaTemp);
                    Toast.makeText(requireContext(), "Funcionário cadastrado com sucesso!", Toast.LENGTH_SHORT).show();
                    limparFormulario();
                    break;
                case ERROR:
                    binding.btnCadastrar.setEnabled(true);
                    Toast.makeText(requireContext(), resource.message, Toast.LENGTH_LONG).show();
                    break;
            }
        });
    }

    private void limparFormulario() {
        binding.etNome.setText("");
        binding.etEmail.setText("");
        binding.etTag.setText("");
        emailAutoFill = true;
        tagAutoFill = true;
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
