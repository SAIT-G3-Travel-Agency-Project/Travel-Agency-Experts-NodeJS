// Routes for users
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport');
const Destination = require('../models/destinations');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


// Dashboard
// Register dashboard page
const {ensureAuthenticated, authRole, loggedInRedirect} = require('../config/auth');

router.get('/dashboard', ensureAuthenticated, authRole("admin"), async (req, res) => {
    res.locals.currentUser = req.user;
    const destinations = await Destination.find().sort({
        createdAt: 'desc'
    });
    res.render('../views/dashboard', {
        name: req.user.name,
        destinations: destinations
    })
});

router.get('/dashboard/destinations', ensureAuthenticated, authRole("admin"), async (req, res) => {
    const destinations = await Destination.find().sort({
        createdAt: 'desc'
    });
     res.render('../views/dashboard/destinations', {
         name: req.user.name,
         destinations: destinations
     })
});

// User Model
const User = require('../models/users')

router.get('/dashboard/user-manager', ensureAuthenticated, authRole("admin"), async (req, res) => {
    res.locals.currentUser = req.user;
    const users = await User.find().sort({
        createdAt: 'desc'
    });
    res.render('../views/dashboard/user-manager', { users: users });
});

router.get('/dashboard/user-manager/edit/:id', ensureAuthenticated, async (req, res) => {
    const users = await User.findById(req.params.id);
    res.render('../views/dashboard/user-manager/edit', {users: users, ROLES: [ 'member', 'agent', 'admin']});
});

router.put('/dashboard/user-manager/edit/:id', async (req, res) => {
    const users = await User.findById(req.params.id);
    let updateUsername = users;
    updateUsername.name = req.body.name;
    updateUsername.email = req.body.email;
    updateUsername.role = req.body.role;
    updateUsername = await updateUsername.save();
    res.redirect('/dashboard/user-manager/')
});


router.get('/dashboard/profile', ensureAuthenticated, async (req, res) => {
    res.locals.currentUser = req.user;
    res.render('../views/dashboard/profile')
});

router.put('/dashboard/profile', async (req, res) => {
    res.locals.currentUser = req.user;
    let updateUsername = req.user;
    updateUsername.name = req.body.name;
    updateUsername.email = req.body.email;
    if (req.body.profilePicture == null) return
    const profilepic = JSON.parse(req.body.profilePicture)
    if (profilepic != null && imageMimeTypes.includes(profilepic.type)) {
      updateUsername.profilePicture = new Buffer.from(profilepic.data, 'base64')
      updateUsername.profilePictureType = profilepic.type
    } 

    updateUsername = await updateUsername.save();
    res.redirect('/dashboard/profile')
});

router.get('/login', loggedInRedirect, (req, res) => {
    res.render('../views/login')
});

router.get('/register', loggedInRedirect, (req, res) => {
    res.render('../views/register')
});

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    // Check required fields
    if(!email || !name || !password || !password2 ){
        errors.push({ msg: 'Please fill in all fields' });
    }
    // Check passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    // Check pass length
    if(password.length < 6) {
        errors.push({ msg: 'Password must exceed 6 characters' })
    }
    if (errors.length > 0) {
        res.render('register', {
            errors, 
            name,
            email,
            password,
            password2
        });
    } else {
        // Validated user sucessfully :)
        User.findOne({
            email: email
        }) 
        .then(user => {
            if(user) {
                // User exists
                errors.push({ msg: 'Email is already registered!'})
                res.render('register', {
                    errors, 
                    name,
                    email,
                    password,
                    password2
                });               
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err,salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', "You are now registered!");
                                res.redirect('login');
                            
                            })
                            .catch(err => console.log(err));
                }));
            }
        })
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
})

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out :)')
    res.redirect('login');
});

module.exports = router;