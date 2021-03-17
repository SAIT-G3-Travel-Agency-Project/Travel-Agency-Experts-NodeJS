// Routes for destination creation
const express = require('express');
const Destination = require('../models/destinations');
const router = express.Router();
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const {ensureAuthenticated} = require('../config/auth');


router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('destinations/new', {destination: new Destination() });
});

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    const destination = await Destination.findById(req.params.id);
    res.render('destinations/edit', {destination: destination});
});

router.get('/:slug', async (req, res) => {
    const destination = await Destination.findOne({ slug: req.params.slug });
    if (destination == null) res.redirect('/');
    res.render('destinations/show', {destination: destination});
});

// New 
router.post('/', ensureAuthenticated, async (req, res, next) => {
    req.destination = new Destination();
    next();
}, saveDestinationAndRedirect('new'));

// Edit
router.put('/:id', ensureAuthenticated, async (req, res, next) => {
    req.destination = await Destination.findById(req.params.id)
    next();
}, saveDestinationAndRedirect('edit'));


router.delete('/:id', ensureAuthenticated, async (req, res) => {
    await Destination.findByIdAndDelete(req.params.id)
    res.redirect('/')
});

function saveDestinationAndRedirect(path) {
    return async (req, res) => {
        let destination = req.destination;
        destination.title = req.body.title;
        destination.description = req.body.description;
        destination.markdown = req.body.markdown;
        destination.colorSelector = req.body.colorSelector;
        if (req.body.cover == null) return
        const cover = JSON.parse(req.body.cover)
        if (cover != null && imageMimeTypes.includes(cover.type)) {
          destination.coverImage = new Buffer.from(cover.data, 'base64')
          destination.coverImageType = cover.type
        }                 
        try {
            destination = await destination.save();
            res.redirect(`/destinations/${destination.slug}`)
        } catch (e) {
            res.render(`destinations/${path}`, {destination: destination })
        }
    }
}

module.exports = router;