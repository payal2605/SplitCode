const mongoose = require("mongoose")
const {Schema} = mongoose;


const userSchema = new Schema({
	googleId: String,
	name: String,
	code: String,
	 files: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "File"
      }
   ]

});


module.exports = mongoose.model('users',userSchema);