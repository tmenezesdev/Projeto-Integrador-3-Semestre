package com.smartbench.app.ui.auth;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.SweepGradient;
import android.util.AttributeSet;
import android.view.animation.LinearInterpolator;
import android.widget.FrameLayout;

/**
 * FrameLayout com borda rotatória animada.
 * Replica o efeito de conic-gradient girando do card de login do web.
 */
public class AnimatedBorderCard extends FrameLayout {

    private static final float BORDER_DP = 1.5f;
    private static final float RADIUS_DP = 16f;

    private float rotationDeg = 0f;
    private final Paint borderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF rect = new RectF();
    private ValueAnimator rotAnim;
    private float density;

    public AnimatedBorderCard(Context context) { super(context); init(); }
    public AnimatedBorderCard(Context context, AttributeSet attrs) { super(context, attrs); init(); }

    private void init() {
        density = getResources().getDisplayMetrics().density;
        setWillNotDraw(false);

        int pad = (int)(BORDER_DP * density);
        setPadding(pad, pad, pad, pad);

        borderPaint.setStyle(Paint.Style.STROKE);
        borderPaint.setStrokeWidth(BORDER_DP * density * 2.5f);
        borderPaint.setAntiAlias(true);

        rotAnim = ValueAnimator.ofFloat(0f, 360f);
        rotAnim.setDuration(6000);
        rotAnim.setRepeatCount(ValueAnimator.INFINITE);
        rotAnim.setInterpolator(new LinearInterpolator());
        rotAnim.addUpdateListener(a -> {
            rotationDeg = (float) a.getAnimatedValue();
            invalidate();
        });
        rotAnim.start();
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldW, int oldH) {
        super.onSizeChanged(w, h, oldW, oldH);
        float half = BORDER_DP * density;
        rect.set(half, half, w - half, h - half);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        if (rect.isEmpty()) return;
        float cx = rect.centerX(), cy = rect.centerY();

        canvas.save();
        canvas.rotate(rotationDeg, cx, cy);
        borderPaint.setShader(new SweepGradient(cx, cy,
            new int[]{0xFF7033FF, 0xFF2DD4BF, 0xFFF59E0B, 0xFFA855F7, 0xFF7033FF},
            new float[]  {0f,        0.25f,     0.50f,     0.75f,      1f}));
        canvas.drawRoundRect(rect, RADIUS_DP * density, RADIUS_DP * density, borderPaint);
        canvas.restore();

        super.onDraw(canvas);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        if (rotAnim != null) rotAnim.cancel();
    }
}
