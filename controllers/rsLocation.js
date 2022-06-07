// Import Models
const Location = require('../models/rsLocation');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require('../cloudinary');

module.exports.index = async(req, res) => {
    const locations = await Location.find({});
    res.render('location/index', {locations});
}

module.exports.newPage = async(req, res) => {
    res.render('location/new');
}

module.exports.uploadRS = async(req, res) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const newLocation = new Location(req.body);

    geodata.body.features[0].geometry.coordinates = [req.body.longitude, req.body.latitude];
    newLocation.geometry = geodata.body.features[0].geometry;
    newLocation.geometry.coordinates = geodata.body.features[0].geometry.coordinates;
    newLocation.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    await newLocation.save();
    res.redirect(`/location`);
}

module.exports.searchLocation = async(req, res) => {
    const inputLocation = new Location(req.body);
    const tempLocation = inputLocation.title.toUpperCase();
    const locations = await Location.find({ title: { $regex: tempLocation } });
    res.render('location/index', {locations});
}

module.exports.showPage = async(req, res) => {
    const locations = await Location.find({});
    const {id} = req.params;
    const location = await Location.findById(id);
    res.render('location/show', {locations, location});
}

module.exports.editPage = async(req, res) => {
    const {id} = req.params;
    const location = await Location.findById(id);
    res.render('location/edit', {location});
}

module.exports.editRS = async(req, res) => {
    const {id} = req.params;
    const location = await Location.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    location.images.push(...imgs);
    await location.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await location.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    res.redirect(`/location/${location._id}`);
}

module.exports.deleteRS = async(req, res) => {
    const {id} = req.params;
    const location = await Location.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await location.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    const deletedLocation = await Location.findByIdAndDelete(id);
    res.redirect('/location');
}