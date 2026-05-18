package com.smartbench.app.data.model.entity;

import com.google.gson.annotations.SerializedName;

public class Transacao {
    public int id;

    @SerializedName("usuario_id")
    public int usuarioId;

    @SerializedName("ferramenta_id")
    public int ferramentaId;

    // historico retorna "operacao"; outros endpoints retornam "tipo"
    public String tipo;
    public String operacao;

    public String metodo;
    public String observacao;

    // historico retorna "dataHora"; outros retornam "data_hora"
    @SerializedName("dataHora")
    public String dataHora;

    @SerializedName("data_hora")
    public String dataHoraSnake;

    public String getDataHora() {
        return dataHora != null ? dataHora : dataHoraSnake;
    }

    public String getTipo() {
        return operacao != null ? operacao : tipo;
    }

    // Campos de join
    public String ferramenta;

    @SerializedName("tagRfid")
    public String tagRfid;

    public String responsavel;
    public String cargo;

    @SerializedName("horaRetirada")
    public String horaRetirada;

    @SerializedName("minutosFora")
    public Long minutosFora;

    @SerializedName("tempoForaLabel")
    public String tempoForaLabel;

    @SerializedName("statusAlerta")
    public String statusAlerta;
}
