const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    kode: { type: Number, required: true, unique: true },
    supplier: { type: String, required: true },
    alamat: { type: String },
    kota: { type: String },
    npwp: { type: String },
    telp: { type: String },
    kodePos: { type: String },
    contact1: { type: String },
    contact2: { type: String },
    tempo: { type: String },
})

module.exports = mongoose.model('Supplier', SupplierSchema);