const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategoriesSchema = new Schema({
    title: { type: String },
    content: { type: [String] },
});

module.exports = mongoose.model('Category', CategoriesSchema);
module.exports.CategoriesSchema = CategoriesSchema;
