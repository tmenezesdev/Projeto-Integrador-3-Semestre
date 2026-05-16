package com.smartbench.app.data.model.entity;

import com.google.gson.annotations.SerializedName;

public class ConfiguracaoSistema {
    public int id;

    @SerializedName("tempo_limite_horas")
    public int tempoLimiteHoras;

    @SerializedName("tempo_aviso_minutos")
    public int tempoAvisoMinutos;

    @SerializedName("modo_manutencao")
    public boolean modoManutencao;

    @SerializedName("chat_ativo")
    public boolean chatAtivo;
}
