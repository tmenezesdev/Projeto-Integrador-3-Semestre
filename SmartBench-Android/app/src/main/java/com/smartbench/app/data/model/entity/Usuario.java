package com.smartbench.app.data.model.entity;

import com.google.gson.annotations.SerializedName;

public class Usuario {
    public int id;
    public String nome;
    public String email;

    @SerializedName("tag_cracha")
    public String tagCracha;

    @SerializedName("tipo_perfil")
    public String tipoPerfil;

    @SerializedName("foto_url")
    public String fotoUrl;

    @SerializedName("data_criacao")
    public String dataCriacao;

    // Senha — usada apenas para criação/edição (não retornada pela API)
    public String senha;

    public String getNomeInicial() {
        if (nome != null && !nome.isEmpty()) return String.valueOf(nome.charAt(0)).toUpperCase();
        return "?";
    }
}
