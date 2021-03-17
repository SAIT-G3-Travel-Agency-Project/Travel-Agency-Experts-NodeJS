const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    logoTitle: {
        type: String,
        default: "Paradise Travel Agency",
        required: true
    },
    siteDescription: {
        type: String,
        default: "Travel the world",
        required: true
    }    
});

module.exports = mongoose.model('customization', destinationSchema);
