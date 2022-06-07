const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Require Multer for Img Upload
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

// Import Controllers
const location = require('../controllers/rsLocation');

// Router
router.route('/')
    .get(location.index)
    .post(upload.array('image'), catchAsync(location.uploadRS));
router.get('/new', location.newPage);
router.route('/:id')
    .get(catchAsync(location.showPage))
    .put(upload.array('image'), catchAsync(location.editRS))
    .delete(catchAsync(location.deleteRS));
router.get('/:id/edit', catchAsync(location.editPage));
router.post('/search', catchAsync(location.searchLocation));

module.exports = router;