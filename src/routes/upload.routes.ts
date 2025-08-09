import { Router } from 'express';
import upload from '#controllers/upload.controller';
// import * as postSchema from '#validations/upload.schema';
import { validate } from '#middlewares/validate.middleware';
import { checkToken } from '#middlewares/checkToken.middleware';
// import { uploadSingle } from '#middlewares/upload.middleware';
import { uploadSingle } from '#middlewares/upload.middleware';

import { uploadEngine } from '#middlewares/uploadEngine.middleware'

const router = Router();


// router.post('/single',uploadSingle('file'), upload.uploadSingle);
router.post('/single2',
    uploadEngine({
        field: 'file',
        folder: 'users',
        validations: {
        allowedTypes: ['image/png', 'image/jpeg'],
        maxSizeMB: 2
        },
        storeInBodyAs: 'avatarPath'
    })
  , upload.uploadSingle);

// router.post('/single',uploadSingle('file'), function (req, res, next) {
//     if (!req.file) {
//         return res.status(400).json({
//             success: false,
//             message: 'No file uploaded',
//         });
//     }

//     return res.json({
//         success: true,
//         message: 'File uploaded successfully',
//         data: {
//             filename: req.file.filename,
//             path:  `${process.env.BASE_URL}uploads/${req.file.filename}`,
//         },
//     });

//     res.json({
//         success: true,
//         message: 'File uploaded successfully',
//     });
// });

export default router;
