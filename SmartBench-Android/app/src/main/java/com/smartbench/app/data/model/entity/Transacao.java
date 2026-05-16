package com.smartbench.app.data.model.entity;

import com.google.gson.annotations.SerializedName;

public class Transacao {
    public int id;

    @SerializedName("usuario_id")
    public int usuarioId;

    @SerializedName("ferramenta_id")
    public int ferramentaId;

    public String tipo;   // RETIRADA | DEVOLUCAO
    public String metodo; // RFID_AUTOMATICO | MANUAL
    public String observacao;

    @SerializedName("data_hora")
    public String dataHora;

    // Campos de join (retornados pela API nos endpoints de histórico)
    public String ferramenta;

    @SerializedName("tag_rfid")
    public String tagRfid;

    public String responsavel;
    public String cargo;

    @SerializedName("hora_retirada")
    public String horaRetirada;

    @SerializedName("minutos_fora")
    public Long minutosFora;

    @SerializedName("tempo_fora_label")
    public String tempoForaLabel;

    @SerializedName("status_alerta")
    public String statusAlerta;
}
