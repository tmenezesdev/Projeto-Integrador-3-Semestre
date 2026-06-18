package com.smartbench.app.data.api;

import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.data.model.entity.ChatMensagem;
import com.smartbench.app.data.model.entity.ConfiguracaoSistema;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.entity.FluxoPonto;
import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.data.model.request.AlterarSenhaRequest;
import com.smartbench.app.data.model.request.CriarFuncionarioRequest;
import com.smartbench.app.data.model.request.DevolucaoMecanicoRequest;
import com.smartbench.app.data.model.request.DevolucaoRequest;
import com.smartbench.app.data.model.request.LoginRequest;
import com.smartbench.app.data.model.response.ApiResponse;
import com.smartbench.app.data.model.response.ChatStatus;
import com.smartbench.app.data.model.response.DashboardAdminResponse;
import com.smartbench.app.data.model.response.DashboardSupervisorResponse;
import com.smartbench.app.data.model.response.LoginResponse;

import java.util.List;
import java.util.Map;

import okhttp3.MultipartBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {

    // ===================== CHAT =====================
    @GET("api/chat/status")
    Call<ChatStatus> getChatStatus();

    @GET("api/chat")
    Call<List<ChatMensagem>> getMensagens();

    @POST("api/chat")
    Call<ApiResponse<Void>> enviarMensagem(@Body Map<String, String> body);

    // ===================== AUTH =====================
    @POST("api/auth/login")
    Call<ApiResponse<LoginResponse>> login(@Body LoginRequest body);

    @POST("api/auth/esqueceu-senha")
    Call<ApiResponse<Void>> esqueceuSenha(@Body Map<String, String> body);

    @POST("api/auth/redefinir-senha")
    Call<ApiResponse<Void>> redefinirSenha(@Body Map<String, String> body);

    // ===================== ADMIN =====================
    // Dashboard retorna dados diretos sem wrapper ApiResponse
    @GET("api/admin/dashboard")
    Call<DashboardAdminResponse> getAdminDashboard();

    // Usuários
    @GET("api/admin/usuarios")
    Call<ApiResponse<List<Usuario>>> getUsuarios();

    @POST("api/admin/usuarios")
    Call<ApiResponse<Usuario>> criarUsuario(@Body Usuario usuario);

    @PUT("api/admin/usuarios/{id}")
    Call<ApiResponse<Usuario>> editarUsuario(@Path("id") int id, @Body Usuario usuario);

    @DELETE("api/admin/usuarios/{id}")
    Call<ApiResponse<Void>> deletarUsuario(@Path("id") int id);

    // Ferramentas
    @GET("api/admin/ferramentas")
    Call<ApiResponse<List<Ferramenta>>> getFerramentasAdmin();

    @POST("api/admin/ferramentas")
    Call<ApiResponse<Ferramenta>> criarFerramenta(@Body Ferramenta ferramenta);

    @PUT("api/admin/ferramentas/{id}")
    Call<ApiResponse<Ferramenta>> editarFerramenta(@Path("id") int id, @Body Ferramenta ferramenta);

    @DELETE("api/admin/ferramentas/{id}")
    Call<ApiResponse<Void>> deletarFerramenta(@Path("id") int id);

    // Histórico e Alertas
    @GET("api/admin/historico")
    Call<ApiResponse<List<Transacao>>> getHistoricoAdmin();

    @GET("api/admin/alertas")
    Call<ApiResponse<List<Alerta>>> getAlertasAdmin();

    @PUT("api/admin/alertas/{id}/resolver")
    Call<ApiResponse<Void>> resolverAlerta(@Path("id") int id);

    // Fluxo e Configurações
    @GET("api/admin/fluxo-movimentacoes")
    Call<ApiResponse<List<FluxoPonto>>> getFluxoAdmin(@Query("periodo") int dias);

    @GET("api/admin/configuracoes")
    Call<ApiResponse<ConfiguracaoSistema>> getConfiguracoes();

    @PUT("api/admin/configuracoes")
    Call<ApiResponse<Void>> salvarConfiguracoes(@Body ConfiguracaoSistema config);

    // Perfil Admin
    @GET("api/admin/perfil")
    Call<ApiResponse<Usuario>> getPerfilAdmin();

    @PUT("api/admin/perfil")
    Call<ApiResponse<Void>> atualizarPerfilAdmin(@Body Map<String, String> body);

    @PUT("api/admin/perfil/senha")
    Call<ApiResponse<Void>> alterarSenhaAdmin(@Body AlterarSenhaRequest body);

    @GET("api/admin/perfil/stats")
    Call<ApiResponse<Map<String, Integer>>> getStatsAdmin();

    @Multipart
    @POST("api/admin/perfil/foto")
    Call<ApiResponse<Void>> uploadFotoAdmin(@Part MultipartBody.Part foto);

    // ===================== SUPERVISOR =====================
    // visaogeral e ferramentas-fora retornam dados diretos sem wrapper
    @GET("api/supervisor/visaogeral")
    Call<DashboardSupervisorResponse> getVisaoGeral();

    @GET("api/supervisor/ferramentas-fora")
    Call<List<Ferramenta>> getFerramentasFora();

    @POST("api/supervisor/ferramentas-fora/devolucao")
    Call<ApiResponse<Void>> registrarDevolucao(@Body DevolucaoRequest body);

    @GET("api/supervisor/historico")
    Call<ApiResponse<List<Transacao>>> getHistoricoSupervisor();

    // alertas supervisor retorna array direto sem wrapper
    @GET("api/supervisor/alertas")
    Call<List<Alerta>> getAlertasSupervisor();

    @GET("api/supervisor/fluxo-movimentacoes")
    Call<ApiResponse<List<FluxoPonto>>> getFluxoSupervisor(@Query("periodo") int dias);

    @POST("api/supervisor/funcionarios")
    Call<ApiResponse<Map<String, Object>>> criarFuncionario(@Body CriarFuncionarioRequest body);

    // Perfil Supervisor
    @GET("api/supervisor/perfil")
    Call<ApiResponse<Usuario>> getPerfilSupervisor();

    @PUT("api/supervisor/perfil")
    Call<ApiResponse<Void>> atualizarPerfilSupervisor(@Body Map<String, String> body);

    @PUT("api/supervisor/perfil/senha")
    Call<ApiResponse<Void>> alterarSenhaSupervisor(@Body AlterarSenhaRequest body);

    @Multipart
    @POST("api/supervisor/perfil/foto")
    Call<ApiResponse<Void>> uploadFotoSupervisor(@Part MultipartBody.Part foto);

    // ===================== MECÂNICO =====================
    @GET("api/mecanico/minhas-retiradas")
    Call<ApiResponse<List<Transacao>>> getMinhasRetiradas();

    @GET("api/mecanico/ferramentas")
    Call<ApiResponse<List<Ferramenta>>> getFerramentasMecanico();

    @POST("api/mecanico/devolucao")
    Call<ApiResponse<Void>> registrarDevolucaoMecanico(@Body DevolucaoMecanicoRequest body);

    @GET("api/mecanico/alertas")
    Call<ApiResponse<List<Alerta>>> getAlertasMecanico();

    @GET("api/mecanico/historico")
    Call<ApiResponse<List<Transacao>>> getHistoricoMecanico();

    @GET("api/mecanico/perfil")
    Call<ApiResponse<Usuario>> getPerfilMecanico();

    @PUT("api/mecanico/perfil")
    Call<ApiResponse<Void>> atualizarPerfilMecanico(@Body Map<String, String> body);

    @PUT("api/mecanico/perfil/senha")
    Call<ApiResponse<Void>> alterarSenhaMecanico(@Body AlterarSenhaRequest body);

    @GET("api/mecanico/perfil/stats")
    Call<ApiResponse<Map<String, Integer>>> getStatsMecanico();

    @Multipart
    @POST("api/mecanico/perfil/foto")
    Call<ApiResponse<Void>> uploadFotoMecanico(@Part MultipartBody.Part foto);
}
