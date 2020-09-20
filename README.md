# SplitCode
A Collaborative Code Editor where developers can collaborate, share, and edit code in real-time

<img src="/public/demo.gif" width="800" height="400"/>

## How to start

> 1.Clone this project  

> 2.Run npm install  


> 3.DataBase:
>> 1.Log in to https://account.mongodb.com/account/login?signedOut=true

>> 2.Follow Step 3 from https://intercom.help/mongodb-atlas/en/articles/3013643-creating-databases-and-collections-for-atlas-clusters, paste the connection string in *config/dev.js* next to mongoURI(localhost)


> 4.Setup Google Authentication:
>> Follow https://developers.google.com/identity/protocols/oauth2/web-server

>>Fetch *googleClientId* and *googleClientSecret* and paste it in *config/dev.js*


> 5.Run npm start

## Technologies used
1. Node.js(Express)
2. MongoDB
3. Socket.io
4. OT.js
5. JavaScript
