package com.smartbench.app.ui.common;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RadialGradient;
import android.graphics.Shader;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.View;

import java.util.ArrayList;
import java.util.List;

/**
 * Fundo animado suave para as telas pós-login.
 * Exibe 2 blobs lentos na cor do perfil atual (lido via ?attr/colorPrimary).
 */
public class AnimatedBlobView extends View {

    private int primaryColor;
    private float density;
    private float tx1, ty1, tx2, ty2;
    private final Paint blobPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final List<ValueAnimator> animators = new ArrayList<>();

    public AnimatedBlobView(Context context) { super(context); init(); }
    public AnimatedBlobView(Context context, AttributeSet attrs) { super(context, attrs); init(); }

    private void init() {
        density = getResources().getDisplayMetrics().density;
        setLayerType(LAYER_TYPE_HARDWARE, null);

        TypedValue tv = new TypedValue();
        if (getContext().getTheme().resolveAttribute(
                com.google.android.material.R.attr.colorPrimary, tv, true)) {
            primaryColor = tv.data;
        } else {
            primaryColor = 0xFF7033FF;
        }
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldW, int oldH) {
        super.onSizeChanged(w, h, oldW, oldH);
        if (w > 0 && h > 0) {
            for (ValueAnimator a : animators) a.cancel();
            animators.clear();

            float d1 = 60 * density, d2 = 40 * density;

            ValueAnimator a1x = ofReverse(-d1, d1, 24000);
            a1x.addUpdateListener(a -> { tx1 = (float) a.getAnimatedValue(); invalidate(); });

            ValueAnimator a1y = ofReverse(-d2, d2, 30000);
            a1y.addUpdateListener(a -> ty1 = (float) a.getAnimatedValue());

            ValueAnimator a2x = ofReverse(d2, -d2, 20000);
            a2x.addUpdateListener(a -> tx2 = (float) a.getAnimatedValue());

            ValueAnimator a2y = ofReverse(-d1, d1, 26000);
            a2y.addUpdateListener(a -> ty2 = (float) a.getAnimatedValue());

            animators.add(a1x); animators.add(a1y);
            animators.add(a2x); animators.add(a2y);
        }
    }

    private ValueAnimator ofReverse(float from, float to, long dur) {
        ValueAnimator va = ValueAnimator.ofFloat(from, to);
        va.setDuration(dur);
        va.setRepeatMode(ValueAnimator.REVERSE);
        va.setRepeatCount(ValueAnimator.INFINITE);
        va.start();
        return va;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        if (getWidth() == 0 || getHeight() == 0) return;
        float w = getWidth(), h = getHeight();

        int r = (primaryColor >> 16) & 0xFF;
        int g = (primaryColor >> 8)  & 0xFF;
        int b = primaryColor         & 0xFF;
        int rgb = (r << 16) | (g << 8) | b;

        // Blob grande (~55% do ecrã) — 15% opacidade
        drawBlob(canvas, w * 0.5f + tx1, h * 0.42f + ty1, Math.max(w, h) * 0.55f,
            0x26000000 | rgb);

        // Blob menor (~38% do ecrã) — 10% opacidade
        drawBlob(canvas, w * 0.75f + tx2, h * 0.65f + ty2, Math.max(w, h) * 0.38f,
            0x1A000000 | rgb);
    }

    private void drawBlob(Canvas canvas, float cx, float cy, float radius, int centerColor) {
        blobPaint.setShader(new RadialGradient(cx, cy, radius,
            new int[]{centerColor, 0x00000000}, null, Shader.TileMode.CLAMP));
        canvas.drawCircle(cx, cy, radius, blobPaint);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        for (ValueAnimator a : animators) a.cancel();
        animators.clear();
    }
}
