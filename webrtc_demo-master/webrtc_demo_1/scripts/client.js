// check if browser support webrtc

function hasUserMedia(){
    navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUSerMedia || navigator.msGetUserMedia;
    return !!navigator.getUserMedia
}

if (hasUserMedia()){
    navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUSerMedia || navigator.msGetUserMedia;
    //get both video and audio streams from user's camera 
    navigator.getUserMedia({video:true,audio:true},function(stream){
        var video=document.querySelector('video');
        //insert stream into the video tag -- below does not work
       // video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream; 

    },function (err){});
}
else{
    alert("Error. WebRTC is not supported!"); 
}