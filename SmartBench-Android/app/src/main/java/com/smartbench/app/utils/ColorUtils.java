package com.smartbench.app.utils;

import android.graphics.Color;

public class ColorUtils {

    public static int getColorForPerfil(String tipoPerfil) {
        if (tipoPerfil == null) return Color.parseColor("#9CA3AF");
        switch (tipoPerfil) {
            case "ADMIN":      return Color.parseColor("#7033FF");
            case "SUPERVISOR": return Color.parseColor("#2DD4BF");
            default:           return Color.parseColor("#F59E0B"); // MECANICO
        }
    }

    public static int getColorForStatus(String status) {
        if (status == null) return Color.parseColor("#9CA3AF");
        switch (status) {
            case "DISPONIVEL": return Color.parseColor("#22C55E");
            case "EM_USO":     return Color.parseColor("#F59E0B");
            case "MANUTENCAO": return Color.parseColor("#EF4444");
            default:           return Color.parseColor("#9CA3AF");
        }
    }

    public static int getColorForAlertaStatus(String status) {
        if ("RESOLVIDO".equals(status)) return Color.parseColor("#22C55E");
        return Color.parseColor("#EF4444");
    }

    public static int getColorForOperacao(String tipo) {
        if ("DEVOLUCAO".equals(tipo)) return Color.parseColor("#22C55E");
        return Color.parseColor("#F97316"); // RETIRADA
    }

    public static int getColorForNivelAtraso(String nivel) {
        if (nivel == null) return Color.parseColor("#EAB308");
        switch (nivel) {
            case "CRITICO": return Color.parseColor("#EF4444");
            case "ALTO":    return Color.parseColor("#F97316");
            default:        return Color.parseColor("#EAB308"); // MODERADO
        }
    }

    public static int withAlpha(int color, float alpha) {
        int a = Math.round(alpha * 255);
        return Color.argb(a, Color.red(color), Color.green(color), Color.blue(color));
    }
}
