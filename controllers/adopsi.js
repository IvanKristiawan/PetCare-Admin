// Import Models
const Adopsi = require('../models/adopsi');
const {cloudinary} = require('../cloudinary');

// Routing Adopsi
module.exports.index = async(req, res) => {
    const listAdopsi = await Adopsi.find({});
    res.render('adopsi/index', {listAdopsi});
}

module.exports.newPage = async(req, res) => {
    res.render('adopsi/new');
}

module.exports.uploadAnimal = async(req, res) => {
    const newHewan = new Adopsi(req.body);
    newHewan.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    await newHewan.save();
    res.redirect(`/adopsi`);
}

module.exports.showPage = async(req, res) => {
    const {id} = req.params;
    const animal = await Adopsi.findById(id);
    res.render('adopsi/show', {animal});
}

module.exports.searchAnimal = async(req, res) => {
    const inputAnimal = new Adopsi(req.body);
    const tempAnimal = inputAnimal.nama.toUpperCase();
    const listAdopsi = await Adopsi.find({nama:{$regex: tempAnimal}});
    res.render('adopsi/index', {listAdopsi});
}

module.exports.editPage = async(req, res) => {
    const {id} = req.params;
    const animal = await Adopsi.findById(id);
    res.render('adopsi/edit', {animal});
}

module.exports.editAnimal = async(req, res) => {
    const {id} = req.params;
    const animal = await Adopsi.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    animal.images.push(...imgs);
    await animal.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await animal.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    res.redirect(`/adopsi/${animal._id}`);
}

module.exports.deleteAnimal = async(req, res) => {
    const {id} = req.params;
    const animal = await Adopsi.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await animal.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    const deletedAnimal = await Adopsi.findByIdAndDelete(id);
    res.redirect('/adopsi');
}