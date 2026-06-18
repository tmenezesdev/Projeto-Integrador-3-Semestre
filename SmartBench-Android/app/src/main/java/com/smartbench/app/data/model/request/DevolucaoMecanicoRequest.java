package com.smartbench.app.data.model.request;

import com.google.gson.annotations.SerializedName;

public class DevolucaoMecanicoRequest {
    @SerializedName("ferramentaId")
    public int ferramentaId;

    @SerializedName("tagCracha")
    public String tagCracha;

    public DevolucaoMecanicoRequest(int ferramentaId, String tagCracha) {
        this.ferramentaId = ferramentaId;
        this.tagCracha = tagCracha;
    }
}
