const mongoose = require("mongoose");
const { Schema } = require("mongoose");

module.exports = mongoose.model('Post', {
    msg: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, 'Posts');