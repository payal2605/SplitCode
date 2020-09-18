const User = require('../models/Users');
const File = require('../models/Files');

module.exports = (app) => {

app.post('/user/:id/newFile',isLoggedIn,function(req, res) {
  if(req.params.id != req.user._id){
      return res.redirect('/login');
    }
     User.findById(req.params.id,function(err, user){
       if(err){
           console.log(err);
           res.redirect('/user/'+req.user._id);
       } else {
        var newFile = new File();
        newFile.name = req.body.name;
        newFile.language = req.body.language;
        user.files.push(newFile);
        user.save();
        newFile.save(function(err,data){
          if(err) {
            console.log(err);
            res.send(err);
          }
          else{
           res.redirect('/user/'+req.params.id+'/files/'+ data._id);
           }
         });
      }})
})

app.get('/user/:id/files/:fileid',function(req, res) {
  if (req.params.fileid) {

    File.findOne({ _id: req.params.fileid }, function(err, data) {
      if (err) {
        console.log(err);
        res.send('404 Not Found');
      }

      if (data) {
        var displayName;
        if(req.user){
          displayName=req.user.name;
        } else{
          displayName='User'+ Math.floor(Math.random() * 9999).toString();
        }
        console.log(displayName ,"is currently accessing the file")
        res.render('file', {data:data,displayName:displayName});
      } 
    })
  } else {
    res.send("Unable to fetch the file");
  }
});

app.get('/user/:id/files/:fileid/delete',isLoggedIn,function(req, res) {
  if(req.params.id != req.user._id){
      return res.redirect('/login');
    }
  User.findByIdAndUpdate(req.params.id, {
    $pull: {
      files: req.params.fileid
    }
  }, (err) => {
    if(err){ 
        console.log(err)
        res.redirect('/user/'+req.params.id);
    } else {
      File.remove({ _id: req.params.fileid}, function(err) {
          if (err) {
            res.send(err);
         }
        else {
            res.redirect('/user/'+req.params.id);
        }
     });
}})
})
}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect("/login")
  }
}