const User = require('../models/Users');
const File = require('../models/Files');

module.exports = (app) => {

app.get('/',(req,res)=>{
  if(req.user){
    res.redirect('/user/'+req.user._id);
  }else{
    res.redirect("/login");
  }
})

app.get('/profile',(req,res)=>{
	console.log(req.user._id);
	res.redirect('/user/'+req.user._id);
})



app.get("/user/:id",isLoggedIn,function(req,res){
    if(req.params.id != req.user._id){
      return res.redirect('/login');
    }
    User.findById(req.params.id).populate({path: 'files', options: { sort: {"updatedAt": -1 } } }).exec(function(err, foundUser){
        if(err || !foundUser){
            console.log(err);
            res.send(err);
         }
        //render show files with that user
        res.render("home", {user: foundUser});
    });
});

}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect("/login")
  }
}