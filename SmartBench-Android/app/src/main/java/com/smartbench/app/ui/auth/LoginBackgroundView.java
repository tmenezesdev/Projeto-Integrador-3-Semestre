package com.smartbench.app.ui.auth;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.BlurMaskFilter;
import android.graphics.Canvas;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.RadialGradient;
import android.graphics.Shader;
import android.util.AttributeSet;
import android.view.View;
import android.view.animation.LinearInterpolator;

import java.util.ArrayList;
import java.util.List;

/**
 * Custom View que replica o fundo animado do login web:
 * grid scrollando, blobs coloridos morfando, vinheta, raios de luz e partículas flutuantes.
 */
public class LoginBackgroundView extends View {

    private static final int BG_COLOR = 0xFF04030D;

    // Blobs: cor base (RGB), opacidade, tamanho em dp, posição relativa X/Y, deslocamento max X/Y dp, duração ms
    private static final float[][] BLOB_DATA = {
        // color_r, color_g, color_b, alpha, sizeDp, relX, relY, dxDp, dyDp, durationMs
        {0x70, 0x33, 0xFF, 0.55f, 580, 0.48f, 0.42f, 60, 60, 12000},
        {0xF5, 0x9E, 0x0B, 0.45f, 420, 0.18f, 0.72f, 50, 50, 15000},
        {0x2D, 0xD4, 0xBF, 0.40f, 380, 0.72f, 0.15f, 40, 60, 18000},
        {0xA8, 0x55, 0xF7, 0.30f, 280, 0.10f, 0.20f, 40, 40, 10000},
    };

    private final float[] blobTx = new float[4];
    private final float[] blobTy = new float[4];

    private static final int PARTICLE_COUNT = 16;
    private float[] px, py, pyStart, palpha, psize;
    private int[] pcolor;

    private float gridOffset = 0f;
    private final float[] streakX = new float[]{-9999, -9999, -9999};

    private final Paint blobPaint    = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint gridPaint    = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint streakPaint  = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint particlePaint= new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint vignettePaint= new Paint(Paint.ANTI_ALIAS_FLAG);

    private final List<ValueAnimator> animators = new ArrayList<>();
    private float density;
    private boolean ready = false;

    public LoginBackgroundView(Context context) { super(context); init(); }
    public LoginBackgroundView(Context context, AttributeSet attrs) { super(context, attrs); init(); }

    private void init() {
        density = getResources().getDisplayMetrics().density;
        setLayerType(LAYER_TYPE_HARDWARE, null);

        gridPaint.setStyle(Paint.Style.STROKE);
        gridPaint.setStrokeWidth(density);
        gridPaint.setColor(0x097033FF);

        streakPaint.setStyle(Paint.Style.STROKE);
        streakPaint.setStrokeWidth(density);

        particlePaint.setStyle(Paint.Style.FILL);
        particlePaint.setMaskFilter(new BlurMaskFilter(3 * density, BlurMaskFilter.Blur.NORMAL));
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldW, int oldH) {
        super.onSizeChanged(w, h, oldW, oldH);
        if (w > 0 && h > 0) {
            setupParticles(w, h);
            setupVignette(w, h);
            stopAnimators();
            startAnimators(w, h);
            ready = true;
        }
    }

    private void setupParticles(int w, int h) {
        float[] relX = {0.07f,0.23f,0.38f,0.55f,0.72f,0.88f,0.14f,0.48f,
                         0.30f,0.78f,0.62f,0.18f,0.93f,0.42f,0.05f,0.85f};
        float[] relY = {0.18f,0.65f,0.32f,0.80f,0.12f,0.50f,0.78f,0.90f,
                         0.45f,0.35f,0.08f,0.88f,0.72f,0.55f,0.50f,0.90f};
        int[] colors = {0xA87FFF, 0xF59E0B, 0x2DD4BF, 0x7033FF};

        px       = new float[PARTICLE_COUNT];
        py       = new float[PARTICLE_COUNT];
        pyStart  = new float[PARTICLE_COUNT];
        palpha   = new float[PARTICLE_COUNT];
        psize    = new float[PARTICLE_COUNT];
        pcolor   = new int[PARTICLE_COUNT];

        for (int i = 0; i < PARTICLE_COUNT; i++) {
            px[i]      = relX[i] * w;
            pyStart[i] = relY[i] * h;
            py[i]      = pyStart[i];
            palpha[i]  = 0f;
            psize[i]   = (i % 2 == 0 ? 2f : 3f) * density;
            pcolor[i]  = colors[i % colors.length];
        }
    }

    private void setupVignette(int w, int h) {
        RadialGradient rg = new RadialGradient(
            w / 2f, h / 2f, Math.max(w, h) * 0.72f,
            new int[]{0x00000000, 0xCC04030D},
            new float[]{0.35f, 1f},
            Shader.TileMode.CLAMP);
        vignettePaint.setShader(rg);
    }

    private void startAnimators(int w, int h) {
        // Blobs
        for (int i = 0; i < BLOB_DATA.length; i++) {
            final int idx = i;
            float dxPx = BLOB_DATA[i][7] * density;
            float dyPx = BLOB_DATA[i][8] * density;
            long dur   = (long) BLOB_DATA[i][9];

            ValueAnimator ax = ValueAnimator.ofFloat(-dxPx, dxPx);
            ax.setDuration(dur);
            ax.setRepeatMode(ValueAnimator.REVERSE);
            ax.setRepeatCount(ValueAnimator.INFINITE);
            ax.addUpdateListener(a -> { blobTx[idx] = (float) a.getAnimatedValue(); invalidate(); });
            ax.start(); animators.add(ax);

            ValueAnimator ay = ValueAnimator.ofFloat(-dyPx, dyPx);
            ay.setDuration((long)(dur * 1.3f));
            ay.setRepeatMode(ValueAnimator.REVERSE);
            ay.setRepeatCount(ValueAnimator.INFINITE);
            ay.addUpdateListener(a -> blobTy[idx] = (float) a.getAnimatedValue());
            ay.start(); animators.add(ay);
        }

        // Grid scroll
        float gridPx = 60 * density;
        ValueAnimator gridAnim = ValueAnimator.ofFloat(0, gridPx);
        gridAnim.setDuration(10000);
        gridAnim.setRepeatCount(ValueAnimator.INFINITE);
        gridAnim.setInterpolator(new LinearInterpolator());
        gridAnim.addUpdateListener(a -> gridOffset = (float) a.getAnimatedValue());
        gridAnim.start(); animators.add(gridAnim);

        // Streaks
        int[] sdur = {7000, 9000, 11000};
        long[] sdel = {0L, 3500L, 6000L};
        for (int i = 0; i < 3; i++) {
            final int si = i;
            ValueAnimator sa = ValueAnimator.ofFloat(-w, w * 1.5f);
            sa.setDuration(sdur[i]);
            sa.setStartDelay(sdel[i]);
            sa.setRepeatCount(ValueAnimator.INFINITE);
            sa.setInterpolator(new LinearInterpolator());
            sa.addUpdateListener(a -> streakX[si] = (float) a.getAnimatedValue());
            sa.start(); animators.add(sa);
        }

        // Particles
        int[]  pdur = {9000,12000,8000,13000,7000,11000,10000,9000,14000,8000,11000,7000,10000,9000,13000,11000};
        long[] pdel = {0,1400,2800,600,3500,1900,4200,300,2100,3000,1600,4700,2600,900,1100,3800};
        float travelPx = 140 * density;
        for (int i = 0; i < PARTICLE_COUNT; i++) {
            final int pi = i;
            ValueAnimator pa = ValueAnimator.ofFloat(0f, 1f);
            pa.setDuration(pdur[i]);
            pa.setStartDelay(pdel[i]);
            pa.setRepeatCount(ValueAnimator.INFINITE);
            pa.setInterpolator(new LinearInterpolator());
            pa.addUpdateListener(a -> {
                float t = (float) a.getAnimatedValue();
                py[pi] = pyStart[pi] - t * travelPx;
                if (t < 0.15f)      palpha[pi] = t / 0.15f;
                else if (t < 0.85f) palpha[pi] = 1f;
                else                palpha[pi] = (1f - t) / 0.15f;
            });
            pa.start(); animators.add(pa);
        }
    }

    private void stopAnimators() {
        for (ValueAnimator a : animators) a.cancel();
        animators.clear();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        if (!ready) return;
        int w = getWidth(), h = getHeight();

        canvas.drawColor(BG_COLOR);
        drawGrid(canvas, w, h);
        drawBlobs(canvas, w, h);
        canvas.drawRect(0, 0, w, h, vignettePaint);
        drawStreaks(canvas, w, h);
        drawParticles(canvas);
    }

    private void drawGrid(Canvas canvas, int w, int h) {
        float step = 60 * density;
        for (float y = gridOffset - step; y < h + step; y += step)
            canvas.drawLine(0, y, w, y, gridPaint);
        for (float x = 0; x < w + step; x += step)
            canvas.drawLine(x, 0, x, h, gridPaint);
    }

    private void drawBlobs(Canvas canvas, int w, int h) {
        for (int i = 0; i < BLOB_DATA.length; i++) {
            float[] b = BLOB_DATA[i];
            float cx   = b[5] * w + blobTx[i];
            float cy   = b[6] * h + blobTy[i];
            float rad  = b[4] * density / 2f;
            int alpha  = (int)(b[3] * 255);
            int center = (alpha << 24) | ((int)b[0] << 16) | ((int)b[1] << 8) | (int)b[2];

            blobPaint.setShader(new RadialGradient(cx, cy, rad,
                new int[]{center, 0x00000000}, null, Shader.TileMode.CLAMP));
            canvas.drawCircle(cx, cy, rad, blobPaint);
        }
    }

    private void drawStreaks(Canvas canvas, int w, int h) {
        float[] tops = {0.25f, 0.60f, 0.40f};
        int[][] sColors = {
            {0x007033FF, 0x807033FF, 0x402DD4BF, 0x00000000},
            {0x00F59E0B, 0x80F59E0B, 0x407033FF, 0x00000000},
            {0x002DD4BF, 0x802DD4BF, 0x00000000, 0x00000000},
        };
        float sw = w * 0.4f;
        for (int i = 0; i < 3; i++) {
            float x = streakX[i];
            float y = tops[i] * h;
            canvas.save();
            canvas.rotate(-25, x + sw / 2, y);
            streakPaint.setShader(new LinearGradient(x, y, x + sw, y,
                sColors[i], null, Shader.TileMode.CLAMP));
            canvas.drawLine(x, y, x + sw, y, streakPaint);
            canvas.restore();
        }
    }

    private void drawParticles(Canvas canvas) {
        for (int i = 0; i < PARTICLE_COUNT; i++) {
            int c = pcolor[i];
            int alpha = (int)(palpha[i] * 200);
            particlePaint.setColor((alpha << 24) | (c & 0x00FFFFFF));
            canvas.drawCircle(px[i], py[i], psize[i], particlePaint);
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        stopAnimators();
    }
}
