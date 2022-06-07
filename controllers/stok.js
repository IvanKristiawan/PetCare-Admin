// Import Models
const GroupStok = require('../models/groupStok');
const SubGroupStok = require('../models/subGroupStok');
const Stok = require('../models/stok');
const { cloudinary } = require('../cloudinary');

// Routing Stok
module.exports.index = async(req, res) => {
    res.render('stok/index');
}

// Routing Group Stok
module.exports.groupStokPage = async(req, res) => {
    const groupStoks = await GroupStok.find({});
    res.render('stok/groupStok/index', { groupStoks });
}

module.exports.searchGroupStok = async(req, res) => {
    const inputGroupStok = new GroupStok(req.body);
    const tempGroupStok = inputGroupStok.namaGroupStok.toUpperCase();
    const groupStoks = await GroupStok.find({ namaGroupStok: { $regex: tempGroupStok } });
    res.render('stok/groupStok/index', { groupStoks });
}

module.exports.newGroupStokPage = async(req, res) => {
    res.render('stok/groupStok/new');
}

module.exports.uploadGroupStok = async(req, res) => {
    const newGroupStok = new GroupStok(req.body);
    await newGroupStok.save();
    res.redirect(`/stoks/groupStok`);
}

module.exports.showGroupStokPage = async(req, res) => {
    const groupStoks = await GroupStok.find({});
    const { id } = req.params;
    const groupStok = await GroupStok.findById(id);
    res.render('stok/groupStok/show', { groupStoks, groupStok });
}

module.exports.editGroupStokPage = async(req, res) => {
    const { id } = req.params;
    const groupStok = await GroupStok.findById(id);
    res.render('stok/groupStok/edit', { groupStok });
}

module.exports.editGroupStok = async(req, res) => {
    const { id } = req.params;
    const groupStok = await GroupStok.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/stoks/groupStok/${groupStok._id}`);
}

module.exports.deleteGroupStok = async(req, res) => {
    const { id } = req.params;
    const deletedGroupStok = await GroupStok.findByIdAndDelete(id);
    res.redirect('/stoks/groupStok');
}

// Routing Sub Group Stok
module.exports.subGroupStokPage = async(req, res) => {
    const subGroupStoks = await SubGroupStok.find({});
    res.render('stok/subGroupStok/index', { subGroupStoks });
}

module.exports.searchSubGroupStok = async(req, res) => {
    const inputSubGroupStok = new SubGroupStok(req.body);
    const tempSubGroupStok = inputSubGroupStok.namaSubGroup.toUpperCase();
    const subGroupStoks = await SubGroupStok.find({ namaSubGroup: { $regex: tempSubGroupStok } });
    res.render('stok/subGroupStok/index', { subGroupStoks });
}

module.exports.newSubGroupStokPage = async(req, res) => {
    const groupStoks = await GroupStok.find({});
    res.render('stok/subGroupStok/new', { groupStoks });
}

module.exports.uploadSubGroupStok = async(req, res) => {
    const newSubGroupStok = new SubGroupStok(req.body);
    await newSubGroupStok.save();
    res.redirect(`/stoks/subGroupStok`);
}

module.exports.showSubGroupStokPage = async(req, res) => {
    const subGroupStoks = await SubGroupStok.find({});
    const { id } = req.params;
    const subGroupStok = await SubGroupStok.findById(id);
    res.render('stok/subGroupStok/show', { subGroupStoks, subGroupStok });
}

module.exports.editSubGroupStokPage = async(req, res) => {
    const groupStoks = await GroupStok.find({});
    const { id } = req.params;
    const subGroupStok = await SubGroupStok.findById(id);
    res.render('stok/subGroupStok/edit', { subGroupStok, groupStoks });
}

module.exports.editSubGroupStok = async(req, res) => {
    const { id } = req.params;
    const subGroupStok = await SubGroupStok.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/stoks/subGroupStok/${subGroupStok._id}`);
}

module.exports.deleteSubGroupStok = async(req, res) => {
    const { id } = req.params;
    const deletedSubGroupStok = await SubGroupStok.findByIdAndDelete(id);
    res.redirect('/stoks/subGroupStok');
}

// Routing Main Stok
module.exports.stokPage = async(req, res) => {
    const stoks = await Stok.find({});
    res.render('stok/stok/index', { stoks });
}

module.exports.searchStok = async(req, res) => {
    const inputStok = new Stok(req.body);
    const tempStok = inputStok.nama.toUpperCase();
    const stoks = await Stok.find({ nama: { $regex: tempStok } });
    res.render('stok/stok/index', { stoks });
}

module.exports.newStokPage = async(req, res) => {
    const groupStoks = await GroupStok.find({});
    const subGroupStoks = await SubGroupStok.find({});
    res.render('stok/stok/new', { groupStoks, subGroupStoks });
}

module.exports.uploadStok = async(req, res) => {
    const newStok = new Stok(req.body);
    newStok.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await newStok.save();
    res.redirect(`/stoks/stok`);
}

module.exports.showStokPage = async(req, res) => {
    const stoks = await Stok.find({});
    const { id } = req.params;
    const stok = await Stok.findById(id);
    res.render('stok/stok/show', { stoks, stok });
}

module.exports.editStokPage = async(req, res) => {
    const groupStoks = await GroupStok.find({});
    const subGroupStoks = await SubGroupStok.find({});
    const { id } = req.params;
    const stok = await Stok.findById(id);
    res.render('stok/stok/edit', { stok, groupStoks, subGroupStoks });
}

module.exports.editStok = async(req, res) => {
    const { id } = req.params;
    const stok = await Stok.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    stok.images.push(...imgs);
    await stok.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await stok.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    res.redirect(`/stoks/stok/${stok._id}`);
}

module.exports.deleteStok = async(req, res) => {
    const { id } = req.params;
    const stok = await Stok.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await stok.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    const deletedStok = await Stok.findByIdAndDelete(id);
    res.redirect('/stoks/stok');
}