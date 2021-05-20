# timeline-functions
Visualize various periodic functions on a scrolling timeline. Values are provided through Socket.io and displayed using D3.js. 

A Node Express server hosts a static webpage and a Socket.io feed. The feed continuously broadcasts output values for different periodic functions - sine, square, triange, etc. - to any listening clients. The webpage connects to this feed and subscribes to one of the function channels, then displays the incoming values on a timeline chart. 

## Setup
Node.js is required to run this application. 

```bash
# Clone this repository
git clone https://github.com/rhammell/timeline-functions.git

# Go into the repository
cd timeline-functions

# Install required node packages
npm install

# Start node development server
node app.js
```
With the development server running, open a browser and browse to `localhost:3000` to view the web interface. 

# Usage
Display options allow the user to control which function is visualized, the length of the timeline, and if datapoints are shown. 
<p align="center">
  <img width="800" src="public/img/chart.gif">
</p>
