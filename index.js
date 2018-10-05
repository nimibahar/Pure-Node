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

        //Send the response
        res.end('Hello world\n');

        //Log the request path
        //console.log(`Got a ${httpMethod} request on path: ${trimmedPath} with the query string`, queryStringObject);
        //console.log(`Got a req with this headers: `, headers);
        console.log(`Got a req with this payload: `, buffer);
        })
});

server.listen(3000, () => { console.log('Server is up an running on port 3000') })