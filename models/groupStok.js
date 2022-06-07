const mongoose = require('mongoose');

const GroupStokSchema = new mongoose.Schema({
    kode: {type: String, required: true, unique: true},
    namaGroupStok: {type: String, required: true},
})

module.exports = mongoose.model('GroupStok', GroupStokSchema);