
'use strict';

const constraints = {
    audio: false,
    video: true
  };
// Put variables in global scope to make them available to the browser console.
const video = document.querySelector('video');
const canvas = window.canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 360;

const button = document.querySelector('button');

// check if browser support webrtc
function hasUserMedia(){
    navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUSerMedia || navigator.msGetUserMedia;
    return !!navigator.getUserMedia
}

// on click of button 'Take Picture'
button.onclick=function(){
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
}


if (hasUserMedia()){
    navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUSerMedia || navigator.msGetUserMedia;
    //get both video and audio streams from user's camera 
    navigator.getUserMedia(constraints,function(stream){
        video.srcObject = stream; 
    },function (error){
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    });
}
else{
    alert("Error. WebRTC is not supported!"); 
}