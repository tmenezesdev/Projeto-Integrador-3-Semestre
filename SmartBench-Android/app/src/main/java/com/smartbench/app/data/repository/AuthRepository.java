package com.smartbench.app.data.repository;

import android.content.Context;

import com.smartbench.app.data.api.ApiClient;
import com.smartbench.app.data.api.ApiService;
import com.smartbench.app.data.local.SessionManager;
import com.smartbench.app.data.model.request.LoginRequest;
import com.smartbench.app.data.model.response.ApiResponse;
import com.smartbench.app.data.model.response.LoginResponse;
import com.smartbench.app.data.model.response.Resource;

import androidx.lifecycle.MutableLiveData;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AuthRepository {

    private final ApiService api;
    private final SessionManager sessionManager;

    public AuthRepository(Context context) {
        api = ApiClient.getInstance(context).getService();
        sessionManager = SessionManager.getInstance(context);
    }

    public void login(String email, String senha, MutableLiveData<Resource<LoginResponse>> result) {
        result.setValue(Resource.loading());
        api.login(new LoginRequest(email, senha)).enqueue(new Callback<ApiResponse<LoginResponse>>() {
            @Override
            public void onResponse(Call<ApiResponse<LoginResponse>> call, Response<ApiResponse<LoginResponse>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso) {
                    LoginResponse loginResponse = response.body().dados;
                    sessionManager.saveSession(loginResponse);
                    result.setValue(Resource.success(loginResponse));
                } else {
                    String msg = response.body() != null ? response.body().mensagem : "Credenciais inválidas";
                    result.setValue(Resource.error(msg));
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<LoginResponse>> call, Throwable t) {
                result.setValue(Resource.error("Não foi possível conectar ao servidor"));
            }
        });
    }
}
