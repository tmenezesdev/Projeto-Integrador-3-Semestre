package com.smartbench.app.data.model.response;

public class DashboardAdminResponse {
    // A API retorna camelCase diretamente (sem wrapper ApiResponse)
    public int totalFerramentas;
    public int totalUsuarios;
    public int transacoesHoje;
    public int alertasAtivos;
    public int ferramentasEmUso;
    public int ferramentasManutencao;
    public int mecanicosAtivos;
}
