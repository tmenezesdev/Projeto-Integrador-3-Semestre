package com.smartbench.app.data.api;

import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.smartbench.app.data.local.SessionManager;
import com.smartbench.app.ui.auth.LoginActivity;

import okhttp3.Authenticator;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.Route;

public class TokenAuthenticator implements Authenticator {

    private final Context context;
    private final SessionManager sessionManager;

    public TokenAuthenticator(Context context, SessionManager sessionManager) {
        this.context = context.getApplicationContext();
        this.sessionManager = sessionManager;
    }

    @Nullable
    @Override
    public Request authenticate(@Nullable Route route, @NonNull Response response) {
        // Token expirado ou inválido — limpa sessão e redireciona para Login
        sessionManager.clearSession();
        Intent intent = new Intent(context, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(intent);
        return null; // cancela a request atual
    }
}
