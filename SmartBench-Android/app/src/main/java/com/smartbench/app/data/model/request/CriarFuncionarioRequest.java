package com.smartbench.app.data.model.request;

import com.google.gson.annotations.SerializedName;

public class CriarFuncionarioRequest {
    public String nome;
    public String email;

    @SerializedName("tag_cracha")
    public String tagCracha;

    @SerializedName("tipo_perfil")
    public String tipoPerfil;

    public CriarFuncionarioRequest(String nome, String email, String tagCracha, String tipoPerfil) {
        this.nome = nome;
        this.email = email;
        this.tagCracha = tagCracha;
        this.tipoPerfil = tipoPerfil;
    }
}
