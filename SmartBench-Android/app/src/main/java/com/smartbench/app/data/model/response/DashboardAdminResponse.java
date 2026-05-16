package com.smartbench.app.data.model.response;

import com.google.gson.annotations.SerializedName;
import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.data.model.entity.Transacao;
import java.util.List;

public class DashboardAdminResponse {
    @SerializedName("total_ferramentas")
    public int totalFerramentas;

    @SerializedName("total_usuarios")
    public int totalUsuarios;

    @SerializedName("transacoes_hoje")
    public int transacoesHoje;

    @SerializedName("alertas_ativos")
    public int alertasAtivos;

    @SerializedName("ferramentas_em_uso")
    public int ferramentasEmUso;

    @SerializedName("em_manutencao")
    public int emManutencao;

    @SerializedName("mecanicos_ativos")
    public int mecanicosAtivos;

    @SerializedName("atividade_recente")
    public List<Transacao> atividadeRecente;

    @SerializedName("alertas_recentes")
    public List<Alerta> alertasRecentes;

    // Distribuição
    public int disponivel;
    public int emUso;
    public int manutencao;
}
