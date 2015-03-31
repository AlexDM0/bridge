# Bridge Timeline

This package has 4 parts:

- a timeline interface
- a butotn interface
- a proxy between the two
- a static fileserver including the proxy

The buttons and timeline webpages have all their dependencies in the js, img and css folders. They can be opened anywhere in a HTML 5 supported browser as long as their position relative to those folder is the same.

The proxy is a node.js application.

Requirements:
- npm
- nodejs

To setup the proxy run:

```
npm install
```

Once that is finished, to run just the proxy, run:

```
node proxy
```

You can customize the port that the proxy listens on in the proxy.js file.
Alternatively you can use the server.js to host both a static fileserver (to serve the demo and buttons) and the proxy on the same port and nodejs process.
To do this run:

```
node server
```

You can customize the port on at the top of the server.js file.



To make sure everything knows where to find the proxy you need to redirect the:

```
var proxyAddress
```

adress on top of both the buttons.html and demo.html to match the location of the proxy. This should not be a local adress as external MASTER instances should also be able to find the proxy.




