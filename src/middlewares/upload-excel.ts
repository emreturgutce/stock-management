import multer from 'multer';

const upload = multer({
    limits: {
        fileSize: 100000, // 100KB Limit
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(xlsx)$/)) { // Only Excel Files
            return cb(new Error('File type must be xlsx'));
        }
        return cb(null, true);
    },
});

export const uploadExcel = upload.single('excel');
