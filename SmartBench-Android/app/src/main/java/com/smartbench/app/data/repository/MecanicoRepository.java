package com.smartbench.app.data.repository;

import android.content.Context;

import com.smartbench.app.data.api.ApiClient;
import com.smartbench.app.data.api.ApiService;
import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.data.model.request.AlterarSenhaRequest;
import com.smartbench.app.data.model.response.ApiResponse;
import com.smartbench.app.data.model.response.Resource;

import java.util.List;
import java.util.Map;

import androidx.lifecycle.MutableLiveData;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MecanicoRepository {

    private final ApiService api;

    public MecanicoRepository(Context context) {
        api = ApiClient.getInstance(context).getService();
    }

    public void getMinhasRetiradas(MutableLiveData<Resource<List<Transacao>>> result) {
        result.setValue(Resource.loading());
        api.getMinhasRetiradas().enqueue(new Callback<ApiResponse<List<Transacao>>>() {
            @Override public void onResponse(Call<ApiResponse<List<Transacao>>> call, Response<ApiResponse<List<Transacao>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else result.setValue(Resource.error("Erro ao carregar retiradas"));
            }
            @Override public void onFailure(Call<ApiResponse<List<Transacao>>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getFerramentas(MutableLiveData<Resource<List<Ferramenta>>> result) {
        result.setValue(Resource.loading());
        api.getFerramentasMecanico().enqueue(new Callback<ApiResponse<List<Ferramenta>>>() {
            @Override public void onResponse(Call<ApiResponse<List<Ferramenta>>> call, Response<ApiResponse<List<Ferramenta>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else result.setValue(Resource.error("Erro ao carregar ferramentas"));
            }
            @Override public void onFailure(Call<ApiResponse<List<Ferramenta>>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getAlertas(MutableLiveData<Resource<List<Alerta>>> result) {
        result.setValue(Resource.loading());
        api.getAlertasMecanico().enqueue(new Callback<ApiResponse<List<Alerta>>>() {
            @Override public void onResponse(Call<ApiResponse<List<Alerta>>> call, Response<ApiResponse<List<Alerta>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else result.setValue(Resource.error("Erro ao carregar alertas"));
            }
            @Override public void onFailure(Call<ApiResponse<List<Alerta>>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getHistorico(MutableLiveData<Resource<List<Transacao>>> result) {
        result.setValue(Resource.loading());
        api.getHistoricoMecanico().enqueue(new Callback<ApiResponse<List<Transacao>>>() {
            @Override public void onResponse(Call<ApiResponse<List<Transacao>>> call, Response<ApiResponse<List<Transacao>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else result.setValue(Resource.error("Erro ao carregar histórico"));
            }
            @Override public void onFailure(Call<ApiResponse<List<Transacao>>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getPerfil(MutableLiveData<Resource<Usuario>> result) {
        result.setValue(Resource.loading());
        api.getPerfilMecanico().enqueue(new Callback<ApiResponse<Usuario>>() {
            @Override public void onResponse(Call<ApiResponse<Usuario>> call, Response<ApiResponse<Usuario>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else result.setValue(Resource.error("Erro ao carregar perfil"));
            }
            @Override public void onFailure(Call<ApiResponse<Usuario>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void alterarSenha(AlterarSenhaRequest req, MutableLiveData<Resource<Void>> result) {
        result.setValue(Resource.loading());
        api.alterarSenhaMecanico(req).enqueue(new Callback<ApiResponse<Void>>() {
            @Override public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(null));
                else {
                    String msg = response.body() != null ? response.body().mensagem : "Erro ao alterar senha";
                    result.setValue(Resource.error(msg));
                }
            }
            @Override public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getStats(MutableLiveData<Resource<Map<String, Integer>>> result) {
        result.setValue(Resource.loading());
        api.getStatsMecanico().enqueue(new Callback<ApiResponse<Map<String, Integer>>>() {
            @Override public void onResponse(Call<ApiResponse<Map<String, Integer>>> call, Response<ApiResponse<Map<String, Integer>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else result.setValue(Resource.error("Erro ao carregar estatísticas"));
            }
            @Override public void onFailure(Call<ApiResponse<Map<String, Integer>>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }
}
