const mongoose = require('mongoose');
const ROLE = {
    ADMIN: 'admin',
    MEMBER: 'member'
}
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: Buffer,
        required: false
    },
    profilePictureType: {
        type: String,
        required: false
    },    
    role: {
        type: String,
        required: false,
        default: ROLE.MEMBER
    }
});

UserSchema.virtual('profilePicturePath').get(function() {
    if (this.profilePicture != null && this.profilePictureType != null) {
      return `data:${this.profilePictureType};charset=utf-8;base64,${this.profilePicture.toString('base64')}`
    }
})

const User = mongoose.model('user', UserSchema);

module.exports = User;