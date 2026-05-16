package com.smartbench.app.data.model.response;

public class ApiResponse<T> {
    public boolean sucesso;
    public String mensagem;
    public String erro;
    public T dados;
}
