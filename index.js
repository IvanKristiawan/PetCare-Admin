// Init Package
const express = require('express');
const ejsMate = require('ejs-mate');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const ExpressError = require('./utils/ExpressError');

const supplier = require('./routes/supplier');
const stok = require('./routes/stok');
const location = require('./routes/rsLocation');
const adopsi = require('./routes/adopsi');
// end Init Package

dotenv.config();

// Mongoose Started
mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("DBConnection Successfull!"))
    .catch((err) => console.log(err));
// end Mongoose Started

// Set Package
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// end Set Package

// Use Package
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// end Use Package

// Routing Supplier only ejs
app.use('/suppliers', supplier);
app.use('/stoks', stok);
app.use('/location', location);
app.use('/adopsi', adopsi);

// Routing Main Index
app.get('/', async(req, res) => {
    res.render('index');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', {err});
})

// Use Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("APP IS LISTENING ON PORT 5000");
});
// end Use Port