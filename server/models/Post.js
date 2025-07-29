const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  slug:    { type: String, required: true, unique: true },
  content: { type: String, required: true },
  tags:    [String],
  status:  { type: String, enum: ['draft', 'published'], default: 'published' }
}, { timestamps: true });

// Text index for search (title + content)
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
