const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Import Controllers
const stok = require('../controllers/stok');

// Require Multer for Img Upload
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

// Routing Stok Index Page
router.get('/', stok.index);

// Routing Group Stok
router.route('/groupStok')
    .get(stok.groupStokPage)
    .post(catchAsync(stok.uploadGroupStok));
router.post('/groupStok/search', catchAsync(stok.searchGroupStok));
router.get('/groupStok/new', stok.newGroupStokPage);
router.route('/groupStok/:id')
    .get(catchAsync(stok.showGroupStokPage))
    .put(catchAsync(stok.editGroupStok))
    .delete(catchAsync(stok.deleteGroupStok));
router.get('/groupStok/:id/edit', catchAsync(stok.editGroupStokPage));


// Routing Sub Group Stok
router.route('/subGroupStok')
    .get(stok.subGroupStokPage)
    .post(catchAsync(stok.uploadSubGroupStok));
router.post('/subGroupStok/search', catchAsync(stok.searchSubGroupStok));
router.get('/subGroupStok/new', stok.newSubGroupStokPage);
router.route('/subGroupStok/:id')
    .get(catchAsync(stok.showSubGroupStokPage))
    .put(catchAsync(stok.editSubGroupStok))
    .delete(catchAsync(stok.deleteSubGroupStok));
router.get('/subGroupStok/:id/edit', catchAsync(stok.editSubGroupStokPage));


// Routing Main Stok
router.route('/stok')
    .get(stok.stokPage)
    .post(upload.array('image'), stok.uploadStok);
router.post('/stok/search', stok.searchStok);
router.get('/stok/new', stok.newStokPage);
router.route('/stok/:id')
    .get(stok.showStokPage)
    .put(upload.array('image'), stok.editStok)
    .delete(stok.deleteStok);
router.get('/stok/:id/edit', stok.editStokPage);

module.exports = router;