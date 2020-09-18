const express = require('express');
const mongoose = require("mongoose");
const bodyParser  = require("body-parser");
const User = require('./models/Users');
const File = require('./models/Files');
require('./services/passportAuth');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const mongodb = require("mongodb");
const cookieSession = require('cookie-session');
const passport = require('passport');
const ot = require('ot');
const keys = require("./config/keys");
const fs = require('fs');
const engine = require('ejs');
const exec = require('child_process').exec;
var path = require("path");
const PORT = process.env.PORT || 8000;
const HOST = process.env.YOUR_HOST || '0.0.0.0';

function connectDB(){
console.log("Trying to reconnect")
return mongoose.connect(keys.mongoURI, {
  //autoReconnect:true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify:false,
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000,
}).then(() => console.log('DB Connection Successful'))
    .catch((err) => {
        console.error(err);
        setTimeout(connectDB,10000)
});
}

connectDB();

const app = express();
const server = app.listen(PORT, HOST, function () {
  console.log('Express server listening on %d, in %s mode', PORT, app.get('env'));
}); 
const io = require('socket.io').listen(server);

app.engine('html', engine.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


authRoutes(app);
userRoutes(app);
fileRoutes(app);

var roomList = {};
var lastName = null;
var flag = false;
io.on('connection', function(socket) { 
    socket.on('joinRoom', async function(data) {
    	console.log("joined room")
      if (!roomList[data.room]) {
        console.log("data room not found ", data.room);
         async function findFile(){
          var file= await File.findById(data.room).exec();
          return file;
          }
          var file = await findFile() 
          var socketIOServer = new ot.EditorSocketIOServer(file.sourceCode, [], data.room, function(socket, cb) {
          var self = this;
          console.log(this,"this")
          File.findByIdAndUpdate(data.room, { sourceCode: self.document, updatedAt:Date.now() }, function(err) {
            console.log("file")
            if (err) {
              console.log(err,"err");
              //io.in(data.room).emit('cannot-save',{clients:roomList[data.room].users});
              return cb(false); 
            }
            console.log(cb)
            cb(true);
            console.log("Saving ....", self.document);
            
          });
      
        });
        roomList[data.room] = socketIOServer;
        }
      roomList[data.room].addClient(socket);
      roomList[data.room].setName(socket, data.username);
    
      socket.room = data.room;
      socket.join(data.room);
      io.in(data.room).emit('getClient',{clients:roomList[data.room].users});
    });

    socket.on('chat', function(data) {
      if(data.username===lastName){
        flag=true;
      }
      io.in(data.roomId).emit('chat', {data:data,flag:flag});
      lastName = data.username
      flag=false;
    });

    socket.on('disconnect', function() {
      lastName = null;
      socket.leave(socket.room);
    });
  })

  
	

 