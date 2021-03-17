const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
// RENDER HTML
const createDomPurify = require("dompurify");
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const destinationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
       type: String,
       required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    colorSelector: {
        type: String,
        required: false,
    },
    sanitizedHtml: {
        type: String,
        required: true
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    }
});

destinationSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

destinationSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { 
            lower: true, 
            strict: true 
        });
    }
    if (this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }
    next();
});

module.exports = mongoose.model('Article', destinationSchema);