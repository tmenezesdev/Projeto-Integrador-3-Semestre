package com.smartbench.app.utils;

import android.app.Activity;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

/**
 * Helpers para tratar window insets (edge-to-edge).
 *
 * A partir do Android 15 (targetSdk 35) o sistema desenha o conteúdo atrás da
 * status bar e da barra de navegação. Sem tratar os insets, o topo das telas
 * fica sob a status bar e a bottom nav fica "comida" pela barra do sistema.
 *
 * Estes métodos adicionam os insets ao padding JÁ existente da view (não
 * substituem), então paddings definidos no XML continuam valendo.
 */
public final class InsetsUtils {

    private InsetsUtils() {}

    private static final int BARS =
            WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout();

    /** Liga o modo edge-to-edge para a Activity (conteúdo desenha atrás das barras). */
    public static void setupEdgeToEdge(Activity activity) {
        WindowCompat.setDecorFitsSystemWindows(activity.getWindow(), false);
    }

    /**
     * Aplica os insets nas bordas selecionadas, somando ao padding inicial da view.
     * Quando {@code includeIme} é true, a borda inferior também considera o teclado
     * (usa o maior entre barra de navegação e IME), fazendo o conteúdo subir acima
     * do teclado — substitui o antigo comportamento de adjustResize.
     */
    public static void applyInsets(View view, boolean left, boolean top,
                                   boolean right, boolean bottom, boolean includeIme) {
        final int il = view.getPaddingLeft();
        final int it = view.getPaddingTop();
        final int ir = view.getPaddingRight();
        final int ib = view.getPaddingBottom();
        final int mask = includeIme ? (BARS | WindowInsetsCompat.Type.ime()) : BARS;
        ViewCompat.setOnApplyWindowInsetsListener(view, (v, insets) -> {
            Insets i = insets.getInsets(mask);
            v.setPadding(
                    il + (left ? i.left : 0),
                    it + (top ? i.top : 0),
                    ir + (right ? i.right : 0),
                    ib + (bottom ? i.bottom : 0));
            return insets;
        });
        ViewCompat.requestApplyInsets(view);
    }

    /** Todas as bordas, considerando o teclado no rodapé — para containers de conteúdo. */
    public static void applyAll(View view) {
        applyInsets(view, true, true, true, true, true);
    }

    /** Apenas a borda inferior (barra de navegação) — para a bottom navigation. */
    public static void applyBottom(View view) {
        applyInsets(view, false, false, false, true, false);
    }

    /** Topo e laterais — para telas com conteúdo próprio na parte de baixo. */
    public static void applyTopAndSides(View view) {
        applyInsets(view, true, true, true, false, false);
    }
}
