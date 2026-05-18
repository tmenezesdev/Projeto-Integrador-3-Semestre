package com.smartbench.app.data.repository;

import android.content.Context;

import androidx.lifecycle.MutableLiveData;

import com.smartbench.app.data.api.ApiClient;
import com.smartbench.app.data.api.ApiService;
import com.smartbench.app.data.model.entity.ChatMensagem;
import com.smartbench.app.data.model.response.ApiResponse;
import com.smartbench.app.data.model.response.ChatStatus;
import com.smartbench.app.data.model.response.Resource;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChatRepository {

    private final ApiService api;

    public ChatRepository(Context context) {
        api = ApiClient.getInstance(context).getService();
    }

    public void getStatus(MutableLiveData<ChatStatus> result) {
        api.getChatStatus().enqueue(new Callback<ChatStatus>() {
            @Override public void onResponse(Call<ChatStatus> call, Response<ChatStatus> response) {
                if (response.isSuccessful() && response.body() != null)
                    result.postValue(response.body());
            }
            @Override public void onFailure(Call<ChatStatus> call, Throwable t) {
                ChatStatus fallback = new ChatStatus();
                fallback.chatAtivo = true;
                result.postValue(fallback);
            }
        });
    }

    public void getMensagens(MutableLiveData<Resource<List<ChatMensagem>>> result) {
        api.getMensagens().enqueue(new Callback<List<ChatMensagem>>() {
            @Override public void onResponse(Call<List<ChatMensagem>> call, Response<List<ChatMensagem>> response) {
                if (response.isSuccessful() && response.body() != null)
                    result.postValue(Resource.success(response.body()));
                else
                    result.postValue(Resource.error("Erro ao carregar mensagens"));
            }
            @Override public void onFailure(Call<List<ChatMensagem>> call, Throwable t) {
                result.postValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void enviarMensagem(String conteudo, MutableLiveData<Resource<Void>> result) {
        result.postValue(Resource.loading());
        Map<String, String> body = new HashMap<>();
        body.put("conteudo", conteudo);
        api.enviarMensagem(body).enqueue(new Callback<ApiResponse<Void>>() {
            @Override public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                if (response.isSuccessful())
                    result.postValue(Resource.success(null));
                else
                    result.postValue(Resource.error("Erro ao enviar"));
            }
            @Override public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                result.postValue(Resource.error("Sem conexão"));
            }
        });
    }
}
