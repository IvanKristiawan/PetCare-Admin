const mongoose = require('mongoose');
const GroupStok = require('./groupStok');
const Schema = mongoose.Schema;

const subGroupStokSchema = new Schema({
    kodeSubGroup: {type: String, required: true},
    namaSubGroup: {type: String, required: true},
    kode: {type: String, required: true, unique: false},
    namaGroupStok: {type: String, required: true},
    groupStoks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'GroupStok',
        }
    ]
})

module.exports = mongoose.model('SubGroupStok', subGroupStokSchema);