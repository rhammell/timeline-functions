# timeline-functions
Visualize various periodic functions on a scrolling timeline. Function values are provided through Socket.io and displayed using D3.js. 

A Node Express server functions as the backend of this project, serving the static webpage as a socket feed. The feed continuously sends out values for various periodic functions - sine, square, triangle, etc. The webpage connects to this feed and displays incoming values onto a timeline. 

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
<p align="center">
  <img width="800" src="public/img/chart.gif">
</p>
