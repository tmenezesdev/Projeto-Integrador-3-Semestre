package com.smartbench.app.data.model.request;

import com.google.gson.annotations.SerializedName;

public class AlterarSenhaRequest {
    @SerializedName("senha_atual")
    public String senhaAtual;

    @SerializedName("nova_senha")
    public String novaSenha;

    public AlterarSenhaRequest(String senhaAtual, String novaSenha) {
        this.senhaAtual = senhaAtual;
        this.novaSenha = novaSenha;
    }
}
