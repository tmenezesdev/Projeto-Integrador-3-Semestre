package com.smartbench.app.data.repository;

import android.content.Context;

import com.smartbench.app.data.api.ApiClient;
import com.smartbench.app.data.api.ApiService;
import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.data.model.entity.ConfiguracaoSistema;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.entity.FluxoPonto;
import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.data.model.request.AlterarSenhaRequest;
import com.smartbench.app.data.model.response.ApiResponse;
import com.smartbench.app.data.model.response.DashboardAdminResponse;
import com.smartbench.app.data.model.response.Resource;

import java.util.List;
import java.util.Map;

import androidx.lifecycle.MutableLiveData;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminRepository {

    private final ApiService api;

    public AdminRepository(Context context) {
        api = ApiClient.getInstance(context).getService();
    }

    public void getDashboard(MutableLiveData<Resource<DashboardAdminResponse>> result) {
        result.setValue(Resource.loading());
        api.getAdminDashboard().enqueue(new Callback<ApiResponse<DashboardAdminResponse>>() {
            @Override public void onResponse(Call<ApiResponse<DashboardAdminResponse>> call, Response<ApiResponse<DashboardAdminResponse>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else result.setValue(Resource.error("Erro ao carregar dashboard"));
            }
            @Override public void onFailure(Call<ApiResponse<DashboardAdminResponse>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getUsuarios(MutableLiveData<Resource<List<Usuario>>> result) {
        result.setValue(Resource.loading());
        api.getUsuarios().enqueue(new Callback<ApiResponse<List<Usuario>>>() {
            @Override public void onResponse(Call<ApiResponse<List<Usuario>>> call, Response<ApiResponse<List<Usuario>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else result.setValue(Resource.error("Erro ao carregar usuários"));
            }
            @Override public void onFailure(Call<ApiResponse<List<Usuario>>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void criarUsuario(Usuario usuario, MutableLiveData<Resource<Usuario>> result) {
        result.setValue(Resource.loading());
        api.criarUsuario(usuario).enqueue(new Callback<ApiResponse<Usuario>>() {
            @Override public void onResponse(Call<ApiResponse<Usuario>> call, Response<ApiResponse<Usuario>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else {
                    String msg = response.body() != null ? response.body().mensagem : "Erro ao criar usuário";
                    result.setValue(Resource.error(msg));
                }
            }
            @Override public void onFailure(Call<ApiResponse<Usuario>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void editarUsuario(int id, Usuario usuario, MutableLiveData<Resource<Usuario>> result) {
        result.setValue(Resource.loading());
        api.editarUsuario(id, usuario).enqueue(new Callback<ApiResponse<Usuario>>() {
            @Override public void onResponse(Call<ApiResponse<Usuario>> call, Response<ApiResponse<Usuario>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else {
                    String msg = response.body() != null ? response.body().mensagem : "Erro ao editar";
                    result.setValue(Resource.error(msg));
                }
            }
            @Override public void onFailure(Call<ApiResponse<Usuario>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void deletarUsuario(int id, MutableLiveData<Resource<Void>> result) {
        result.setValue(Resource.loading());
        api.deletarUsuario(id).enqueue(new Callback<ApiResponse<Void>>() {
            @Override public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(null));
                else result.setValue(Resource.error("Erro ao deletar"));
            }
            @Override public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getFerramentas(MutableLiveData<Resource<List<Ferramenta>>> result) {
        result.setValue(Resource.loading());
        api.getFerramentasAdmin().enqueue(new Callback<ApiResponse<List<Ferramenta>>>() {
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

    public void criarFerramenta(Ferramenta f, MutableLiveData<Resource<Ferramenta>> result) {
        result.setValue(Resource.loading());
        api.criarFerramenta(f).enqueue(new Callback<ApiResponse<Ferramenta>>() {
            @Override public void onResponse(Call<ApiResponse<Ferramenta>> call, Response<ApiResponse<Ferramenta>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else {
                    String msg = response.body() != null ? response.body().mensagem : "Erro ao criar";
                    result.setValue(Resource.error(msg));
                }
            }
            @Override public void onFailure(Call<ApiResponse<Ferramenta>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void editarFerramenta(int id, Ferramenta f, MutableLiveData<Resource<Ferramenta>> result) {
        result.setValue(Resource.loading());
        api.editarFerramenta(id, f).enqueue(new Callback<ApiResponse<Ferramenta>>() {
            @Override public void onResponse(Call<ApiResponse<Ferramenta>> call, Response<ApiResponse<Ferramenta>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else {
                    String msg = response.body() != null ? response.body().mensagem : "Erro ao editar";
                    result.setValue(Resource.error(msg));
                }
            }
            @Override public void onFailure(Call<ApiResponse<Ferramenta>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void deletarFerramenta(int id, MutableLiveData<Resource<Void>> result) {
        result.setValue(Resource.loading());
        api.deletarFerramenta(id).enqueue(new Callback<ApiResponse<Void>>() {
            @Override public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(null));
                else result.setValue(Resource.error("Erro ao deletar"));
            }
            @Override public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getHistorico(MutableLiveData<Resource<List<Transacao>>> result) {
        result.setValue(Resource.loading());
        api.getHistoricoAdmin().enqueue(new Callback<ApiResponse<List<Transacao>>>() {
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
        api.getAlertasAdmin().enqueue(new Callback<ApiResponse<List<Alerta>>>() {
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

    public void resolverAlerta(int id, MutableLiveData<Resource<Void>> result) {
        result.setValue(Resource.loading());
        api.resolverAlerta(id).enqueue(new Callback<ApiResponse<Void>>() {
            @Override public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(null));
                else result.setValue(Resource.error("Erro ao resolver alerta"));
            }
            @Override public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getFluxo(int dias, MutableLiveData<Resource<List<FluxoPonto>>> result) {
        result.setValue(Resource.loading());
        api.getFluxoAdmin(dias).enqueue(new Callback<ApiResponse<List<FluxoPonto>>>() {
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

    public void getConfiguracoes(MutableLiveData<Resource<ConfiguracaoSistema>> result) {
        result.setValue(Resource.loading());
        api.getConfiguracoes().enqueue(new Callback<ApiResponse<ConfiguracaoSistema>>() {
            @Override public void onResponse(Call<ApiResponse<ConfiguracaoSistema>> call, Response<ApiResponse<ConfiguracaoSistema>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(response.body().dados));
                else result.setValue(Resource.error("Erro ao carregar configurações"));
            }
            @Override public void onFailure(Call<ApiResponse<ConfiguracaoSistema>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void salvarConfiguracoes(ConfiguracaoSistema config, MutableLiveData<Resource<Void>> result) {
        result.setValue(Resource.loading());
        api.salvarConfiguracoes(config).enqueue(new Callback<ApiResponse<Void>>() {
            @Override public void onResponse(Call<ApiResponse<Void>> call, Response<ApiResponse<Void>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().sucesso)
                    result.setValue(Resource.success(null));
                else result.setValue(Resource.error("Erro ao salvar configurações"));
            }
            @Override public void onFailure(Call<ApiResponse<Void>> call, Throwable t) {
                result.setValue(Resource.error("Sem conexão"));
            }
        });
    }

    public void getPerfil(MutableLiveData<Resource<Usuario>> result) {
        result.setValue(Resource.loading());
        api.getPerfilAdmin().enqueue(new Callback<ApiResponse<Usuario>>() {
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
        api.alterarSenhaAdmin(req).enqueue(new Callback<ApiResponse<Void>>() {
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
        api.getStatsAdmin().enqueue(new Callback<ApiResponse<Map<String, Integer>>>() {
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
