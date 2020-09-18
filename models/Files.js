var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
  name: String,
  sourceCode:{type: String, default:"/** Type your code */"},
  language:{type: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('File', fileSchema);
