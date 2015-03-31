# Bridge Timeline

This package has 3 parts:

- a timeline interface
- a butotn interface
- a proxy between the two

The buttons and timeline webpages have all their dependencies in the js, img and css folders. They can be opened anywhere in a HTML 5 supported browser as long as their position relative to those folder is the same.

The proxy is a node.js application.

Requirements:
- npm
- nodejs

To setup the proxy run:

```
npm install
```

Once that is finished run:

```
node proxy
```

You can customize the port that the proxy listens on in the proxy.js file.



To make sure everything knows where to find the proxy you need to redirect the:

```
var proxyAddress
var proxyAddressHTTP
```

adresses on top of both the buttons.html and demo.html to match the location of the proxy.