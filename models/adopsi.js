const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const adopsiSchema = new Schema({
    images: [ImageSchema],
    nama: String,
    umur: String,
    jenisKelamin: String,
    kategori: String,
    location: String,
    kontak: String,
    description: String
})

module.exports = mongoose.model('Adopsi', adopsiSchema);