webrtc_demo_2
=============
Sample demo on how to use webrtc MediaStream Api to take image from live video
    It will open the camera on chrome or firfox and autoplay the video and one button to capture the image.

To run this app you can use - 
Tomcat
    Drop the webrtc_demo_2 folder under webapps and start the server

Express node.js server
    Install Express - npm install express --save
    Create folder structure like below
        webrtc_demo_2   
            --scripts
                --client.js
            --themes
                --app.css
            --index.html
        webrtc_demo_2.js
        
    Run the node - node webrtc_demo_2.js
    Open browser and run http://localhost:8080/ 