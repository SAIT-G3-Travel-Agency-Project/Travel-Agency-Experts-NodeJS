// Intiate Express
const express = require("express");
const mongoose = require('mongoose');
const Destination = require("./models/destinations")
const User = require('./models/users')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const Agency = require('./models/agencies')


// Passport config
require('./config/passport')(passport);

// Register Routes
const destinationRouter = require('./routes/destinations');

// Method override middleware
const methodOverride = require("method-override");

// Create an Express app and register dependencies
const app = express();
app.use("/assets",express.static(__dirname + "/assets/css"));
app.use("/assets/images",express.static(__dirname + "/assets/images"));
app.use("/assets",express.static(__dirname + "/assets/js"));

// MONGO DB
const db = require('./config/keys').MongoURI;
const router = require("./routes/destinations");

// CONNECT TO OUR DATABASE
mongoose.connect(db,  {
     useNewUrlParser: true, 
     useUnifiedTopology: true,
     useCreateIndex: true
})
.then(() => console.log("MongoDB Connected Sucessfully!"))
.catch(err => console.log(err))

// Register EJS template structure
app.set('view engine', 'ejs');
app.use(express.urlencoded({ 
    limit: '50mb',
    parameterLimit: 100000,
    extended: false
    })
);

// Express session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash Middleware
app.use(flash());

const { ensureAuthenticated, userLoggedInCheck } = require('./config/auth');

// Global Vars Middleware
// These variables are seen by your entire website
app.use(userLoggedInCheck, (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg'); 
    res.locals.error = req.flash('error');
    res.locals.login = req.user; // Tracks user status
    next();  
})

app.use(methodOverride('_method'))

app.use('/', require('./routes/users'));

app.get('/agents', async (req, res) => {
    const agency = await Agency.find().sort({
        createdAt: 'desc'
    });    
    res.render('../views/agents', {agency: agency})
});

app.get('/packages', async (req, res) => {
    res.render('../views/packages')
});

app.get('/newsletter', async (req, res) => {
    res.render('../views/newsletter')
});

app.get('/404', async (req, res) => {
    res.render('../views/404')
});

// Register pages
app.get("/", async (req, res) => {
    const destinations = await Destination.find().sort({
        createdAt: 'desc'
    });
    res.render('destinations/index', { destinations: destinations, test: 'test' });
}); 

// Register pages
app.get("/destinations", async (req, res) => {
    const destinations = await Destination.find().sort({
        createdAt: 'desc'
    });
    res.render('destinations', { destinations: destinations });
}); 

app.use('/destinations', destinationRouter);

app.listen(process.env.PORT || 3000)