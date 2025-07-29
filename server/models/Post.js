const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  slug:    { type: String, required: true, unique: true },
  content: { type: String, required: true },
  tags:    [String],
  imageUrl: { type: String, default: "" },   // NEW FIELD
  status:  { type: String, enum: ['draft', 'published'], default: 'published' }
}, { timestamps: true });

// Text search
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
