const passport = require('passport');
const passportAuth = require("../services/passportAuth")

module.exports = (app) => {

app.get("/login",(req,res)=>{
  res.render("login");
})

app.get(
	'/auth/google',
	passport.authenticate("google",{
		scope: ['profile', 'email']
	})
);

app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/login")
})


app.get('/auth/google/callback',
     passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/fail'
     }));
}