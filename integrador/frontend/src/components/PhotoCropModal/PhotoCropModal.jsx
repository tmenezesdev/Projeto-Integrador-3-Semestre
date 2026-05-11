'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, Loader2, ZoomIn, ZoomOut } from 'lucide-react';

function centerSquareCrop(w, h) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, 1, w, h),
    w, h
  );
}

export default function PhotoCropModal({ imageSrc, onConfirm, onCancel, loading }) {
  const imgRef        = useRef(null);
  const [crop, setCrop]               = useState();
  const [completedCrop, setCompleted] = useState();

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerSquareCrop(width, height));
  }, []);

  const handleConfirm = () => {
    const image = imgRef.current;
    if (!image || !completedCrop?.width) return;

    const canvas  = document.createElement('canvas');
    const scaleX  = image.naturalWidth  / image.width;
    const scaleY  = image.naturalHeight / image.height;
    const size    = 400;
    canvas.width  = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width  * scaleX,
      completedCrop.height * scaleY,
      0, 0, size, size
    );

    canvas.toBlob((blob) => { if (blob) onConfirm(blob); }, 'image/jpeg', 0.92);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
    >
      <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-base">Ajustar foto de perfil</h3>
            <p className="text-slate-500 text-xs mt-0.5">Arraste e redimensione para enquadrar como preferir</p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Crop area */}
        <div className="flex justify-center bg-[#0a0a0c] rounded-xl overflow-hidden" style={{ maxHeight: 400 }}>
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompleted(c)}
            aspect={1}
            circularCrop
            minWidth={60}
            minHeight={60}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              onLoad={onImageLoad}
              alt="Ajuste a foto"
              style={{ maxHeight: 380, maxWidth: '100%', display: 'block' }}
            />
          </ReactCrop>
        </div>

        {/* Preview */}
        {completedCrop?.width > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Prévia:</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500/30 bg-[#0a0a0c]">
              <CropPreview imgRef={imgRef} crop={completedCrop} />
            </div>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/30 bg-[#0a0a0c]">
              <CropPreview imgRef={imgRef} crop={completedCrop} size={64} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end border-t border-white/8 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !completedCrop?.width}
            className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            {loading
              ? <><Loader2 size={14} className="animate-spin" /> Enviando...</>
              : <><Check size={14} /> Usar esta foto</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}

function CropPreview({ imgRef, crop, size = 40 }) {
  const img = imgRef.current;
  if (!img || !crop?.width) return null;

  const scaleX = img.naturalWidth  / img.width;
  const scaleY = img.naturalHeight / img.height;
  const scale  = size / crop.width;

  return (
    <div style={{ width: size, height: size, overflow: 'hidden', position: 'relative' }}>
      <img
        src={img.src}
        alt=""
        style={{
          position:  'absolute',
          width:     img.width  * scale,
          height:    img.height * scale,
          left:      -crop.x * scale,
          top:       -crop.y * scale,
        }}
      />
    </div>
  );
}
