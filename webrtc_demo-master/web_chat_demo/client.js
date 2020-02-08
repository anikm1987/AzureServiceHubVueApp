
'use strict';



  // get reference of webpage elements
  var divSelectRoom=document.getElementById("selectRoom");
  var divConsultingRoom=document.getElementById("consultingRoom");
  var inputRoomNumber=document.getElementById("roomNumber");
  var btnGoRoom=document.getElementById("goRoom");
  var localVideo=document.getElementById("localVideo");
  var remoteVideo=document.getElementById("remoteVideo");

  // global variables
  var roomNumber;
  var localStream;
  var remoteStream;
  var rtcPeerConnection;

  // stun servers
  const iceServers={
      'iceServers':[
          {'url':'stun:23.21.150.121'},
          {'url':'stun:stun.l.google.com:19302'}
      ]
  }

  const streamConstraints = {
    audio: true,
    video: true
  };

  let isCaller;

// connect to socket.io server
const socket=io();

// add click event to the button
btnGoRoom.onclick=function(){
   // alert('I am here'+ inputRoomNumber.value);
    if (inputRoomNumber.value.length<1){
        alert("Please type a room number");
    }
    else{
        roomNumber=inputRoomNumber.value;
        socket.emit('create or join',roomNumber); // send message to server
        divSelectRoom.style="display:none;"; // hide select room div
        //divConsultingRoom.style="display:block;"; // Show Consulting room div
    }
}


// when server emits created
socket.on('created',function(room){
    // caller gets user media
    navigator.getUserMedia(streamConstraints,function(stream){
        localStream=stream;
        localVideo.srcObject=localStream;
        isCaller=true;
    },function (error){
        alert('Error occured accessing media devices');
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    });
})

// when server emits joined
socket.on('joined',function(room){
    // caller gets user media
    navigator.getUserMedia(streamConstraints,function(stream){
        localStream=stream;
        localVideo.srcObject=localStream;
        socket.emit('ready',roomNumber); // send message to server
    },function (error){
        alert('Error occured accessing media devices');
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    });
})

// when server emits ready
socket.on('ready',function(){
    if (isCaller){
            // create RTCPeerConnection Object
            rtcPeerConnection=new RTCPeerConnection(iceServers);

            // add event listeners
            rtcPeerConnection.onicecandidate=onIceCandidate;
            rtcPeerConnection.onaddstream=onAddStream;
            
            // add the local stream to the object
            rtcPeerConnection.addStream(localStream);
            // Prepare an offer
            rtcPeerConnection.createOffer(setLocalAndOffer,function(e){console.log(e)});
        
        }
})

// Server emits offer
socket.on('offer',function(event){
    if (!isCaller){
            // create RTCPeerConnection Object
            rtcPeerConnection=new RTCPeerConnection(iceServers);

            // add event listeners
            rtcPeerConnection.onicecandidate=onIceCandidate;
            rtcPeerConnection.onaddstream=onAddStream;
            
            // add the local stream to the object
            rtcPeerConnection.addStream(localStream);
            // Store the offer as remote description
            rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));

            // Prepare an answer
            rtcPeerConnection.createAnswer(setLocalAndAnswer,function(e){console.log(e)});
        
        }
})

// Server emits answer
socket.on('answer',function(event){
    // Store the offer as remote description
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
    
})

// Server emits full
socket.on('full',function(room){
    alert("Room number : "+ room + " is full.");
    divSelectRoom.style="display:block;";
})


// Server emits candidate
socket.on('candidate',function(event){
    var candidate=new RTCIceCandidate({
        sdpMLineIndex:event.label,
        candidate:event.candidate
    });
    rtcPeerConnection.addIceCandidate(candidate);
})

// when a user receives other user's audio or video stream
function onAddStream(event){
    remoteStream=event.stream;
    remoteVideo.srcObject=remoteStream;
}

// functions referenced before as listener

function onIceCandidate(event){
    if(event.candidate){
        console.log('Sending ICE candidate');
        socket.emit('candidate',{
            type:'candidate',
            label:event.candidate.sdpMLineIndex,
            id:event.candidate.sdpMid,
            candidate:event.candidate.candidate,
            room:roomNumber
        })
    }
}

// stores offer and send message to the server
function setLocalAndOffer(sessionDescription){
    rtcPeerConnection.setLocalDescription(sessionDescription);
    socket.emit('offer',{
        type:'offer',
        sdp:sessionDescription,
        room:roomNumber
    })
}

// stores answer and send message to the server
function setLocalAndAnswer(sessionDescription){
    rtcPeerConnection.setLocalDescription(sessionDescription);
    socket.emit('answer',{
        type:'answer',
        sdp:sessionDescription,
        room:roomNumber
    })
}


