package com.smartbench.app.data.model.request;

import com.google.gson.annotations.SerializedName;

public class DevolucaoRequest {
    @SerializedName("ferramentaId")
    public int ferramentaId;

    @SerializedName("supervisorId")
    public int supervisorId;

    public String observacao;

    public DevolucaoRequest(int ferramentaId, int supervisorId, String observacao) {
        this.ferramentaId = ferramentaId;
        this.supervisorId = supervisorId;
        this.observacao = observacao;
    }
}
