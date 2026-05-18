package com.smartbench.app.data.model.entity;

import com.google.gson.annotations.SerializedName;

public class ChatMensagem {
    public int id;
    public String conteudo;

    @SerializedName("criado_em")
    public String criadoEm;

    public String nome;
    public String perfil;

    @SerializedName("foto_url")
    public String fotoUrl;
}
