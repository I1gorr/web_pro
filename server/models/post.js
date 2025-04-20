const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'Misc' },
  answers: [
    {
      text: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
