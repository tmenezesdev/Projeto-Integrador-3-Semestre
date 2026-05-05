import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880;

// Storage Cloudinary para imagens
const storageImagens = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'smartbench/imagens',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

// Storage Cloudinary para arquivos genéricos
const storageArquivos = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'smartbench/arquivos',
    resource_type: 'auto',
  },
});

const fileFilterImagens = (req, file, cb) => {
  const tiposPermitidos = process.env.ALLOWED_FILE_TYPES
    ? process.env.ALLOWED_FILE_TYPES.split(',').map(t => t.trim())
    : ['image/jpeg', 'image/png', 'image/gif'];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido. Tipos aceitos: ${tiposPermitidos.join(', ')}`), false);
  }
};

export const uploadImagens = multer({
  storage: storageImagens,
  limits: { fileSize: maxFileSize },
  fileFilter: fileFilterImagens,
});

export const uploadArquivos = multer({
  storage: storageArquivos,
  limits: { fileSize: maxFileSize * 2 },
});


export const removerArquivoAntigo = async (publicIdOuUrl) => {
  try {
    if (!publicIdOuUrl) return false;

    let publicId = publicIdOuUrl;
    if (publicIdOuUrl.includes('cloudinary.com')) {
      const partes = publicIdOuUrl.split('/');
      const uploadIndex = partes.indexOf('upload');
      if (uploadIndex !== -1) {
        const semExtensao = partes.slice(uploadIndex + 2).join('/').replace(/\.[^/.]+$/, '');
        publicId = semExtensao;
      }
    }

    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Erro ao remover arquivo do Cloudinary:', error);
    return false;
  }
};

export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        sucesso: false,
        erro: 'Arquivo muito grande',
        mensagem: `Tamanho máximo: ${maxFileSize / 1024 / 1024}MB`,
      });
    }
  }

  if (error.message?.includes('Tipo de arquivo não permitido')) {
    return res.status(400).json({
      sucesso: false,
      erro: 'Tipo de arquivo inválido',
      mensagem: error.message,
    });
  }

  next(error);
};