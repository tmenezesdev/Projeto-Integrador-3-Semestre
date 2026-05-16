package com.smartbench.app.data.api;

import androidx.annotation.NonNull;

import com.smartbench.app.data.local.SessionManager;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {

    private final SessionManager sessionManager;

    public AuthInterceptor(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @NonNull
    @Override
    public Response intercept(@NonNull Chain chain) throws IOException {
        String token = sessionManager.getToken();
        Request original = chain.request();

        if (token == null) return chain.proceed(original);

        Request authenticated = original.newBuilder()
                .header("Authorization", "Bearer " + token)
                .build();

        return chain.proceed(authenticated);
    }
}
