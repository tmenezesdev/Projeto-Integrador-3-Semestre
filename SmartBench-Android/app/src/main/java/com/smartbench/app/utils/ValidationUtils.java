package com.smartbench.app.utils;

import android.util.Patterns;

public class ValidationUtils {

    public static boolean isEmailValid(String email) {
        return email != null && !email.isEmpty() && Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }

    public static boolean isSenhaValid(String senha) {
        return senha != null && senha.length() >= 6;
    }

    public static boolean isTagRfidValid(String tag) {
        return tag != null && !tag.trim().isEmpty();
    }

    public static int getPasswordStrength(String senha) {
        if (senha == null || senha.isEmpty()) return 0;
        int score = 0;
        if (senha.length() >= 8) score++;
        if (senha.matches(".*[A-Z].*")) score++;
        if (senha.matches(".*[0-9].*")) score++;
        if (senha.matches(".*[!@#$%^&*()_+\\-=\\[\\]{}|;:',.<>?].*")) score++;
        return score; // 0-4
    }

    public static String autoFillEmail(String nome) {
        if (nome == null || nome.trim().isEmpty()) return "";
        String[] parts = nome.trim().toLowerCase().split("\\s+");
        if (parts.length == 1) return parts[0] + "@gm.com";
        return parts[0] + "." + parts[parts.length - 1] + "@gm.com";
    }

    public static String autoGenerateTag(String tipoPerfil, long seed) {
        String prefix = "SUPERVISOR".equals(tipoPerfil) ? "TAG-SUP-" : "TAG-MEC-";
        return prefix + String.valueOf(seed).substring(Math.max(0, String.valueOf(seed).length() - 3));
    }
}
