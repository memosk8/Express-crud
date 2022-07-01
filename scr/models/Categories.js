const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategoriesSchema = new Schema({
    title: { type: String },
    content: { type: [String] },
    created_at: {type: Date, default: new Date().toDateString()},
    updated_at: {type: Date}
});

module.exports = mongoose.model('Category', CategoriesSchema);
module.exports.CategoriesSchema = CategoriesSchema;
