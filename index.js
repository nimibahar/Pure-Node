const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const server = http.createServer( (req, res) => {

    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    //Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an object
    const queryStringObject = parsedUrl.query;

    //Get the http method
    const httpMethod = req.method.toLowerCase();

    //Get the headers as an object
    const headers = req.headers;

    //Get the payload if any
    const stringDecoder = new StringDecoder('utf-8');

    let buffer = '';

    req.on('data', (data) => {
        buffer += stringDecoder.write(data);
    });
    req.on('end', () => {
        buffer += stringDecoder.end();

        //Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        const choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? handlers[trimmedPath]: handlers.notFound;
        
        //Construct the data object to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'httpMethod': httpMethod,
            'headers': headers,
            'payload': buffer
        }
        
        // Route the request to the handler specified in the router
        choosenHandler(data, (statusCode, payload) => {
            // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof(statusCode == 'number') ? statusCode : 200;

            // Use the payload returned fron the handler, or set the payload to an empty object
            payload = typeof(payload == 'object') ? payload : {};
            
            // Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log("Returning this response: ",statusCode,payloadString);
        });
        
        //Send the response
        //res.end('Hello world\n');

        //Log the request path
        //console.log(`Got a ${httpMethod} request on path: ${trimmedPath} with the query string`, queryStringObject);
        //console.log(`Got a req with this headers: `, headers);
        //console.log(`Got a req with this payload: `, buffer);
        })
});

server.listen(3000, () => { console.log('Server is up an running on port 3000') })

//Define all the handlers
const handlers = {};

//Sample handler
handlers.sample = ( data, callback) => {
    callback(406, {'name': 'sample'});
};

//Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

//Define the request router 
const router = {
    'sample': handlers.sample
}