const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Import Controllers
const adopsi = require('../controllers/adopsi');

// Require Multer for Img Upload
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

// Routing Stok Index Page
router.route('/')
    .get(adopsi.index)
    .post(upload.array('image'), catchAsync(adopsi.uploadAnimal));
router.get('/new', adopsi.newPage);
router.route('/:id')
    .get(catchAsync(adopsi.showPage))
    .put(upload.array('image'), catchAsync(adopsi.editAnimal))
    .delete(catchAsync(adopsi.deleteAnimal));
router.post('/search', catchAsync(adopsi.searchAnimal));
router.get('/:id/edit', catchAsync(adopsi.editPage));

module.exports = router;