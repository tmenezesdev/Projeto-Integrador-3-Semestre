package com.smartbench.app.data.model.response;

import com.google.gson.annotations.SerializedName;
import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.data.model.entity.Ferramenta;
import java.util.List;

public class DashboardSupervisorResponse {
    @SerializedName("total_ferramentas")
    public int totalFerramentas;

    @SerializedName("em_uso")
    public int emUso;

    @SerializedName("atrasadas")
    public int atrasadas;

    @SerializedName("alertas_ativos")
    public int alertasAtivos;

    @SerializedName("transacoes_hoje")
    public int transacoesHoje;

    @SerializedName("mecanicos_ativos")
    public int mecanicosAtivos;

    @SerializedName("taxa_no_prazo")
    public double taxaNoPrazo;

    @SerializedName("ferramentas_fora")
    public List<Ferramenta> ferramentasFora;

    @SerializedName("alertas_recentes")
    public List<Alerta> alertasRecentes;

    public int disponivel;
    public int manutencao;
}
