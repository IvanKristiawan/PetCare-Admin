const mongoose = require('mongoose');
const SubGroupStok = require('./subGroupStok');
const GroupStok = require('./groupStok');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const stokSchema = new Schema({
    images: [ImageSchema],
    kodeStok: {type: String},
    nama: {type: String, required: true},
    merk: {type: String},
    namaSatuan: {type: String},
    jumlahStok: {type: Number},
    resepDokter: {type: String},
    hargaJual: {type: Number},
    hargaBeli: {type: Number},
    deskripsi: {type: String},
    indikasiUmum: {type: String},
    komposisi: {type: String},
    aturanPakai: {type: String},
    kodeSubGroup: {type: String, required: true},
    namaSubGroup: {type: String, required: true},
    kode: {type: String, required: true, unique: false},
    namaGroupStok: {type: String, required: true},
    subGroupStok: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SubGroupStok',
        }
    ],
    groupStoks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'GroupStok',
        }
    ],
})

module.exports = mongoose.model('Stok', stokSchema);