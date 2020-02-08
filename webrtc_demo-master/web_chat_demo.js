// Initialize express
const express=require('express');
const app=express();
const http = require('http').Server(app);
const io=require('socket.io')(http);

// port number to use for the server
const port = 8080;

//This is to initialize the folder where your application resides

app.use(express.static('web_chat_demo'));


// signalling handlers
io.sockets.on('connection',function(socket){
    console.log('A user connected');

    // client emits create or join
    socket.on('create or join',function(room){
        console.log('Create or join room : '+room);

        // check numbers of users in the room
        //var myRoom=io.socket.adapter.rooms[room] || {length:0};
        //var numClients=myRoom.length;
        var sioRoom = io.sockets.adapter.rooms[room];
        var numClients=0
        if( sioRoom ) { 
        Object.keys(sioRoom.sockets).forEach( function(socketId){
            console.log("sioRoom client socket Id: " + socketId );
            numClients++;
        }); 
        }   
       // var numClients=io.sockets.clients(room).length;
        console.log('Room : '+room + ' has '+ numClients +' clients');

        if (numClients==0){
            socket.join(room);
            socket.emit('created',room);
        }else if(numClients==1){
            socket.join(room);
            socket.emit('joined',room);   
        }else{
            console.log('Room is full');
            socket.emit('full',room);
        }
    })

//relay only handlers
socket.on('ready',function(room){
    socket.broadcast.to(room).emit('ready');
})

socket.on('candidate',function(event){
    socket.broadcast.to(event.room).emit('candidate',event);
})

socket.on('offer',function(event){
    socket.broadcast.to(event.room).emit('offer',event.sdp);
})

socket.on('answer',function(event){
    socket.broadcast.to(event.room).emit('answer',event.sdp);
})

})
// How do I handle 404 responses?
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })

// How do I setup an error handler? 
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

http.listen(port,function(){
    console.log(`Example app listening on port ${port}!`)
})