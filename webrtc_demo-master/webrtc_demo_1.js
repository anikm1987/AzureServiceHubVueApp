// Initialize express
const express=require('express');
const app=express();
// port number to use for the server
const port = 8080;

//This is to initialize the folder where your application resides
app.use(express.static('webrtc_demo_1'));

// How do I handle 404 responses?
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })

// How do I setup an error handler? 
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port,function(){
    console.log(`Example app listening on port ${port}!`)
})