package com.smartbench.app.ui.auth;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.smartbench.app.data.local.SessionManager;
import com.smartbench.app.databinding.ActivityLoginBinding;
import com.smartbench.app.ui.admin.AdminHostActivity;
import com.smartbench.app.ui.mecanico.MecanicoHostActivity;
import com.smartbench.app.ui.supervisor.SupervisorHostActivity;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private LoginViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Se já tem sessão ativa, redireciona direto
        SessionManager session = SessionManager.getInstance(this);
        if (session.isLoggedIn()) {
            redirectByPerfil(session.getTipoPerfil());
            return;
        }

        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(LoginViewModel.class);
        setupObservers();
        setupListeners();
    }

    private void setupObservers() {
        viewModel.loginResult.observe(this, resource -> {
            switch (resource.status) {
                case LOADING:
                    binding.btnLogin.setEnabled(false);
                    binding.progressBar.setVisibility(View.VISIBLE);
                    break;

                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    redirectByPerfil(resource.data.usuario.tipoPerfil);
                    break;

                case ERROR:
                    binding.btnLogin.setEnabled(true);
                    binding.progressBar.setVisibility(View.GONE);
                    Toast.makeText(this, resource.message, Toast.LENGTH_LONG).show();
                    break;
            }
        });
    }

    private void setupListeners() {
        binding.btnLogin.setOnClickListener(v -> {
            String email = binding.etEmail.getText() != null ? binding.etEmail.getText().toString().trim() : "";
            String senha = binding.etSenha.getText() != null ? binding.etSenha.getText().toString() : "";

            if (email.isEmpty()) {
                binding.tilEmail.setError("Informe o e-mail");
                return;
            }
            if (senha.isEmpty()) {
                binding.tilSenha.setError("Informe a senha");
                return;
            }

            binding.tilEmail.setError(null);
            binding.tilSenha.setError(null);
            viewModel.login(email, senha);
        });

        binding.tvEsqueceuSenha.setOnClickListener(v -> {
            startActivity(new Intent(this, RedefinirSenhaActivity.class));
        });
    }

    private void redirectByPerfil(String tipoPerfil) {
        Class<?> destino;
        switch (tipoPerfil) {
            case "ADMIN":      destino = AdminHostActivity.class; break;
            case "SUPERVISOR": destino = SupervisorHostActivity.class; break;
            default:           destino = MecanicoHostActivity.class;
        }
        Intent intent = new Intent(this, destino);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
    }
}
