package com.smartbench.app.data.local;

import android.content.Context;
import android.content.SharedPreferences;

import com.smartbench.app.data.model.response.LoginResponse;

public class SessionManager {

    private static final String PREF_NAME = "smartbench_session";
    private static final String KEY_TOKEN = "token";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_USER_NOME = "user_nome";
    private static final String KEY_USER_EMAIL = "user_email";
    private static final String KEY_TIPO_PERFIL = "tipo_perfil";
    private static final String KEY_FOTO_URL = "foto_url";

    private static SessionManager instance;
    private final SharedPreferences prefs;

    private SessionManager(Context context) {
        prefs = context.getApplicationContext()
                .getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public static synchronized SessionManager getInstance(Context context) {
        if (instance == null) instance = new SessionManager(context);
        return instance;
    }

    public void saveSession(LoginResponse response) {
        prefs.edit()
                .putString(KEY_TOKEN, response.token)
                .putInt(KEY_USER_ID, response.usuario.id)
                .putString(KEY_USER_NOME, response.usuario.nome)
                .putString(KEY_USER_EMAIL, response.usuario.email)
                .putString(KEY_TIPO_PERFIL, response.usuario.tipoPerfil)
                .putString(KEY_FOTO_URL, response.usuario.fotoUrl)
                .apply();
    }

    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    public int getUserId() {
        return prefs.getInt(KEY_USER_ID, -1);
    }

    public String getUserNome() {
        return prefs.getString(KEY_USER_NOME, "");
    }

    public String getUserEmail() {
        return prefs.getString(KEY_USER_EMAIL, "");
    }

    public String getTipoPerfil() {
        return prefs.getString(KEY_TIPO_PERFIL, "");
    }

    public String getFotoUrl() {
        return prefs.getString(KEY_FOTO_URL, null);
    }

    public void updateFotoUrl(String url) {
        prefs.edit().putString(KEY_FOTO_URL, url).apply();
    }

    public void updateNomeEmail(String nome, String email) {
        prefs.edit()
                .putString(KEY_USER_NOME, nome)
                .putString(KEY_USER_EMAIL, email)
                .apply();
    }

    public boolean isLoggedIn() {
        return getToken() != null;
    }

    public void clearSession() {
        prefs.edit().clear().apply();
    }
}
