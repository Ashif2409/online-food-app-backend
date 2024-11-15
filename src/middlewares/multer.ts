import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,path.resolve(__dirname,'../../images'));
    },
    filename: (req, file, cb) => {
        const fileName=`${Date.now()}-${file.originalname}`.trim()
        cb(null,fileName);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    },
});

export default upload;
