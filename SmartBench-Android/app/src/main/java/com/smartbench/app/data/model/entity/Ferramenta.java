package com.smartbench.app.data.model.entity;

import com.google.gson.annotations.SerializedName;

public class Ferramenta {
    public int id;
    public String nome;

    @SerializedName("tag_rfid")
    public String tagRfid;          // admin endpoints usam tag_rfid

    @SerializedName("tagRfid")
    public String tagRfidCamel;     // supervisor/ferramentas-fora usa tagRfid

    @SerializedName("peso_referencia")
    public Double pesoReferencia;

    public String status;

    @SerializedName("data_cadastro")
    public String dataCadastro;

    // Campos retornados por /ferramentas-fora e /minhas-retiradas
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

    public String getTagRfid() {
        return tagRfid != null ? tagRfid : tagRfidCamel;
    }

    public boolean isAtrasada() {
        return "ATRASADA".equals(statusAlerta);
    }

    public String getNivelAtraso() {
        if (minutosFora == null) return null;
        if (minutosFora >= 1440) return "CRITICO";
        if (minutosFora >= 480)  return "ALTO";
        return "MODERADO";
    }
}
