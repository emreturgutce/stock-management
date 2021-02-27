import multer from 'multer';

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg|webp)$/)) {
            return cb(new Error('File must be image'));
        }
        return cb(null, true);
    },
});

export const uploadAvatar = upload.single('avatar');
export const uploadAvatars = upload.array('avatar');
