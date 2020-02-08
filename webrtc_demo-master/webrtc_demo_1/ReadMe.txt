webrtc_demo_1
=============
Sample demo on how to use webrtc MediaStream Api
    It will open the camera on chrome or firfox and autoplay the video

To run this app you can use - 
Tomcat
    Drop the webrtc_demo_1 folder under webapps and start the server

Express node.js server
    Install Express - npm install express --save
    Create folder structure like below
        webrtc_demo_1   
            --scripts
                --client.js
            --index.html
        webrtc_demo_1.js
        
    Run the node - node webrtc_demo_1.js
    Open browser and run http://localhost:8080/ 