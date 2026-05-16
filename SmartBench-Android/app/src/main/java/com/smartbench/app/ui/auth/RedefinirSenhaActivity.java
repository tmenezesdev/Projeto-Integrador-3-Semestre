package com.smartbench.app.ui.auth;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

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

        Button btnEnviar = findViewById(R.id.btnEnviar);
        TextInputLayout tilEmail = findViewById(R.id.tilEmail);
        TextInputEditText etEmail = findViewById(R.id.etEmail);

        btnEnviar.setOnClickListener(v -> {
            String email = etEmail.getText() != null ? etEmail.getText().toString().trim() : "";
            if (email.isEmpty()) {
                tilEmail.setError("Informe o e-mail");
                return;
            }
            tilEmail.setError(null);

            Map<String, String> body = new HashMap<>();
            body.put("email", email);

            ApiClient.getInstance(this).getService().esqueceuSenha(body)
                    .enqueue(new Callback<ApiResponse<Void>>() {
                        @Override public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                            Toast.makeText(RedefinirSenhaActivity.this,
                                    "Se o e-mail existir, você receberá as instruções.", Toast.LENGTH_LONG).show();
                            finish();
                        }
                        @Override public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                            Toast.makeText(RedefinirSenhaActivity.this, "Erro de conexão", Toast.LENGTH_SHORT).show();
                        }
                    });
        });

        if (getSupportActionBar() != null) getSupportActionBar().hide();
        View backBtn = findViewById(R.id.btnBack);
        if (backBtn != null) backBtn.setOnClickListener(v -> finish());
    }
}
