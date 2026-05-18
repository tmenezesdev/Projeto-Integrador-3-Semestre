package com.smartbench.app.data.repository;

import android.content.Context;

import com.smartbench.app.data.api.ApiClient;
import com.smartbench.app.data.api.ApiService;
import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.entity.FluxoPonto;
import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.data.model.request.AlterarSenhaRequest;
import com.smartbench.app.data.model.request.CriarFuncionarioRequest;
import com.smartbench.app.data.model.request.DevolucaoRequest;
import com.smartbench.app.data.model.response.ApiResponse;
import com.smartbench.app.data.model.response.DashboardSupervisorResponse;
import com.smartbench.app.data.model.response.Resource;

import java.util.List;
import java.util.Map;

import androidx.lifecycle.MutableLiveData;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SupervisorRepository {

    private final ApiService api;

    public SupervisorRepository(Context context) {
        api = ApiClient.getInstance(context).getService();
    }

    public void getVisaoGeral(MutableLiveData<Resource<DashboardSupervisorResponse>> result) {
        result.setValue(Resource.loading());
        api.getVisaoGeral().enqueue(new Callback<DashboardSupervisorResponse>() {
            @Override public void onResponse(Call<DashboardSupervisorResponse> call, Response<DashboardSupervisorResponse> response) {
                if (response.isSuccessful() && response.body() != null)
                    result.setValue(Resource.success(response.body()));
                else result.setValue(Resource.error("Erro ao carregar dados"));
            }
            @Override public void onFailure(Call<DashboardSupervisorResponse> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getFerramentasFora(MutableLiveData<Resource<List<Ferramenta>>> result) {
        result.setValue(Resource.loading());
        api.getFerramentasFora().enqueue(new Callback<List<Ferramenta>>() {
            @Override public void onResponse(Call<List<Ferramenta>> call, Response<List<Ferramenta>> response) {
                if (response.isSuccessful() && response.body() != null)
                    result.setValue(Resource.success(response.body()));
                else result.setValue(Resource.error("Erro ao carregar ferramentas"));
            }
            @Override public void onFailure(Call<List<Ferramenta>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void registrarDevolucao(DevolucaoRequest req, MutableLiveData<Resource<Void>> result) {
        result.setValue(Resource.loading());
        api.registrarDevolucao(req).enqueue(new Callback<ApiResponse<Void>>() {
            @Override public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(null));
                else {
                    String msg = response.body() != null ? response.body().mensagem : "Erro na devolução";
                    result.setValue(Resource.error(msg));
                }
            }
            @Override public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getHistorico(MutableLiveData<Resource<List<Transacao>>> result) {
        result.setValue(Resource.loading());
        api.getHistoricoSupervisor().enqueue(new Callback<ApiResponse<List<Transacao>>>() {
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

    public void getAlertas(MutableLiveData<Resource<List<Alerta>>> result) {
        result.setValue(Resource.loading());
        api.getAlertasSupervisor().enqueue(new Callback<List<Alerta>>() {
            @Override public void onResponse(Call<List<Alerta>> call, Response<List<Alerta>> response) {
                if (response.isSuccessful() && response.body() != null)
                    result.setValue(Resource.success(response.body()));
                else result.setValue(Resource.error("Erro ao carregar alertas"));
            }
            @Override public void onFailure(Call<List<Alerta>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getFluxo(int dias, MutableLiveData<Resource<List<FluxoPonto>>> result) {
        result.setValue(Resource.loading());
        api.getFluxoSupervisor(dias).enqueue(new Callback<ApiResponse<List<FluxoPonto>>>() {
            @Override public void onResponse(Call<ApiResponse<List<FluxoPonto>>> call, Response<ApiResponse<List<FluxoPonto>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else result.setValue(Resource.error("Erro ao carregar gráfico"));
            }
            @Override public void onFailure(Call<ApiResponse<List<FluxoPonto>>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getPerfil(MutableLiveData<Resource<Usuario>> result) {
        result.setValue(Resource.loading());
        api.getPerfilSupervisor().enqueue(new Callback<ApiResponse<Usuario>>() {
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
        api.alterarSenhaSupervisor(req).enqueue(new Callback<ApiResponse<Void>>() {
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

    public void criarFuncionario(CriarFuncionarioRequest req, MutableLiveData<Resource<Map<String, Object>>> result) {
        result.setValue(Resource.loading());
        api.criarFuncionario(req).enqueue(new Callback<ApiResponse<Map<String, Object>>>() {
            @Override public void onResponse(Call<ApiResponse<Map<String, Object>>> call, Response<ApiResponse<Map<String, Object>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else {
                    String msg = response.body() != null ? response.body().mensagem : "Erro ao cadastrar";
                    result.setValue(Resource.error(msg));
                }
            }
            @Override public void onFailure(Call<ApiResponse<Map<String, Object>>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }
}
