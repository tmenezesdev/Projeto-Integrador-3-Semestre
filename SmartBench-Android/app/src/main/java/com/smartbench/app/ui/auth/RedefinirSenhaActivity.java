package com.smartbench.app.ui.auth;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import com.smartbench.app.R;
import com.smartbench.app.data.api.ApiClient;

import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import com.smartbench.app.data.model.response.ApiResponse;

public class RedefinirSenhaActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_redefinir_senha);

        if (getSupportActionBar() != null) getSupportActionBar().hide();
        View backBtn = findViewById(R.id.btnBack);
        if (backBtn != null) backBtn.setOnClickListener(v -> finish());

        // Verifica se foi aberto via deep link smartbench://reset-senha?token=...
        Uri data = getIntent().getData();
        if (data != null && "smartbench".equals(data.getScheme())) {
            String token = data.getQueryParameter("token");
            if (token != null && !token.isEmpty()) {
                mostrarPainelNovaSenha(token);
                return;
            }
        }

        mostrarPainelEmail();
    }

    private void mostrarPainelEmail() {
        findViewById(R.id.panelEmail).setVisibility(View.VISIBLE);
        findViewById(R.id.panelNovaSenha).setVisibility(View.GONE);

        TextInputLayout tilEmail = findViewById(R.id.tilEmail);
        TextInputEditText etEmail = findViewById(R.id.etEmail);
        MaterialButton btnEnviar = findViewById(R.id.btnEnviar);

        btnEnviar.setOnClickListener(v -> {
            String email = etEmail.getText() != null ? etEmail.getText().toString().trim() : "";
            if (email.isEmpty()) {
                tilEmail.setError("Informe o e-mail");
                return;
            }
            tilEmail.setError(null);
            btnEnviar.setEnabled(false);
            btnEnviar.setText("Enviando...");

            Map<String, String> body = new HashMap<>();
            body.put("email", email);

            ApiClient.getInstance(this).getService().esqueceuSenha(body)
                    .enqueue(new Callback<ApiResponse<Void>>() {
                        @Override
                        public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                            Toast.makeText(RedefinirSenhaActivity.this,
                                    "Se o e-mail existir, você receberá as instruções.", Toast.LENGTH_LONG).show();
                            finish();
                        }

                        @Override
                        public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                            btnEnviar.setEnabled(true);
                            btnEnviar.setText("Enviar instruções");
                            Toast.makeText(RedefinirSenhaActivity.this, "Erro de conexão", Toast.LENGTH_SHORT).show();
                        }
                    });
        });
    }

    private void mostrarPainelNovaSenha(String token) {
        findViewById(R.id.panelEmail).setVisibility(View.GONE);
        findViewById(R.id.panelNovaSenha).setVisibility(View.VISIBLE);

        TextInputLayout tilNovaSenha     = findViewById(R.id.tilNovaSenha);
        TextInputLayout tilConfirmarSenha = findViewById(R.id.tilConfirmarSenha);
        TextInputEditText etNovaSenha    = findViewById(R.id.etNovaSenha);
        TextInputEditText etConfirmar    = findViewById(R.id.etConfirmarSenha);
        MaterialButton btnConfirmar      = findViewById(R.id.btnConfirmar);

        btnConfirmar.setOnClickListener(v -> {
            String nova    = etNovaSenha.getText() != null ? etNovaSenha.getText().toString() : "";
            String confirma = etConfirmar.getText() != null ? etConfirmar.getText().toString() : "";

            tilNovaSenha.setError(null);
            tilConfirmarSenha.setError(null);

            if (nova.length() < 6) {
                tilNovaSenha.setError("Mínimo 6 caracteres");
                return;
            }
            if (!nova.equals(confirma)) {
                tilConfirmarSenha.setError("As senhas não coincidem");
                return;
            }

            btnConfirmar.setEnabled(false);
            btnConfirmar.setText("Redefinindo...");

            Map<String, String> body = new HashMap<>();
            body.put("token", token);
            body.put("nova_senha", nova);

            ApiClient.getInstance(this).getService().redefinirSenha(body)
                    .enqueue(new Callback<ApiResponse<Void>>() {
                        @Override
                        public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                            if (response.isSuccessful()) {
                                Toast.makeText(RedefinirSenhaActivity.this,
                                        "Senha redefinida com sucesso!", Toast.LENGTH_LONG).show();
                                // Volta para o login limpando o back stack
                                Intent intent = new Intent(RedefinirSenhaActivity.this, LoginActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                startActivity(intent);
                            } else {
                                btnConfirmar.setEnabled(true);
                                btnConfirmar.setText("Redefinir senha");
                                Toast.makeText(RedefinirSenhaActivity.this,
                                        "Token inválido ou expirado.", Toast.LENGTH_LONG).show();
                            }
                        }

                        @Override
                        public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                            btnConfirmar.setEnabled(true);
                            btnConfirmar.setText("Redefinir senha");
                            Toast.makeText(RedefinirSenhaActivity.this, "Erro de conexão", Toast.LENGTH_SHORT).show();
                        }
                    });
        });
    }
}
