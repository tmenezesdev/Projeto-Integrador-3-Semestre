package com.smartbench.app.data.model.entity;

import com.google.gson.annotations.SerializedName;

public class Ferramenta {
    public int id;
    public String nome;

    @SerializedName("tag_rfid")
    public String tagRfid;

    @SerializedName("peso_referencia")
    public Double pesoReferencia;

    public String status; // DISPONIVEL | EM_USO | MANUTENCAO

    @SerializedName("data_cadastro")
    public String dataCadastro;

    // Campos de join retornados quando ferramenta está EM_USO
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

    public boolean isAtrasada() {
        return "ATRASADA".equals(statusAlerta);
    }

    public String getNivelAtraso() {
        if (minutosFora == null) return null;
        if (minutosFora >= 1440) return "CRITICO";
        if (minutosFora >= 480) return "ALTO";
        return "MODERADO";
    }
}
