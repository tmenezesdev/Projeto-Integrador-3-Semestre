package com.smartbench.app.data.model.entity;

import com.google.gson.annotations.SerializedName;

public class Alerta {
    public int id;

    @SerializedName("ferramenta_id")
    public int ferramentaId;

    @SerializedName("usuario_id")
    public Integer usuarioId;

    public String mensagem;

    @SerializedName("status_alerta")
    public String statusAlerta; // ATIVO | RESOLVIDO

    @SerializedName("data_geracao")
    public String dataGeracao;

    // Campos de join
    public String ferramenta;

    @SerializedName("tag_rfid")
    public String tagRfid;

    public String responsavel;
}
