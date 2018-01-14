const spawn = require("child_process").spawnSync;
var path = require("path");

exports.handler = function(event, context) {

    // Sets some sane defaults here so that this function doesn't fail
    // when it's not handling a HTTP request from API Gateway.
    var requestMethod = event.httpMethod || 'GET';
    var requestBody = event.body || '';
    var requestUri = event.path || '';
    var headers = {};
    var queryParams = '';

    // Convert all headers passed by API Gateway into the correct format for PHP CGI.
    // This means converting a header such as "X-Test" into "HTTP_X-TEST".
    if (event.headers) {
        Object.keys(event.headers).map(function (key) {
            headers['HTTP_' + key.toUpperCase().replace(/-/g, '_')] = event.headers[key];
            headers[key.toUpperCase().replace(/-/g, '_')] = event.headers[key];
        });
    }

    // Convert query parameters passed by API Gateway into the correct format for PHP CGI.
    if (event.queryStringParameters) {
        var parameters = Object.keys(event.queryStringParameters).map(function(key) {
            var obj = key + "=" + event.queryStringParameters[key];
            return obj;
        });
        queryParams = parameters.join("&");
    }

    // Spawn the PHP CGI process with a bunch of environment variables that describe the request.
    var scriptPath = path.resolve('public/index.php');

    var php = spawn('vendor/uruloke/lambdavel/resources/php-7/bin/php-cgi', ['-f', scriptPath], {
        env: Object.assign({
            REDIRECT_STATUS: 200,
            REQUEST_METHOD: requestMethod,
            SCRIPT_FILENAME: scriptPath,
            SCRIPT_NAME: '/index.php',
            PATH_INFO: '/',
            SERVER_PROTOCOL: 'HTTP/1.1',
            REQUEST_URI: requestUri,
            QUERY_STRING: queryParams,
            AWS_LAMBDA: true,
            CONTENT_LENGTH: Buffer.byteLength(requestBody, 'utf-8')
        }, headers, process.env),
        input: requestBody
    });

    // When the process exists, we should have a compare HTTP response to send back to API Gateway.
    var parsedResponse = parseResponse(php.stdout.toString('utf-8'));

    // Signals the end of the Lambda function, and passes the provided object back to API Gateway.
    context.succeed({
        statusCode: parsedResponse.statusCode || 200,
        headers: parsedResponse.headers,
        body: parsedResponse.body
    });
};


parseResponse = function(responseString) {
    var headerLines, line, lines, parsedStatusLine, response;
    response = {};
    lines = responseString.split(/\r?\n/);
    parsedStatusLine = parseStatusLine(lines.shift());
    response['protocolVersion'] = parsedStatusLine['protocol'];
    response['statusCode'] = parsedStatusLine['statusCode'];
    response['statusMessage'] = parsedStatusLine['statusMessage'];
    headerLines = [];
    while (lines.length > 0) {
        line = lines.shift();
        if (line === "") {
            break;
        }
        headerLines.push(line);
    }
    response['headers'] = parseHeaders(headerLines);
    response['body'] = lines.join('\r\n');
    return response;
};

parseHeaders = function(headerLines) {
    var headers, key, line, parts, _i, _len;
    headers = {};
    for (_i = 0, _len = headerLines.length; _i < _len; _i++) {
        line = headerLines[_i];
        parts = line.split(":");
        key = parts.shift();
        headers[key] = parts.join(":").trim();
    }
    return headers;
};

parseStatusLine = function(statusLine) {
    var parsed, parts;
    parts = statusLine.match(/^(.+) ([0-9]{3}) (.*)$/);
    parsed = {};
    if (parts !== null) {
        parsed['protocol'] = parts[1];
        parsed['statusCode'] = parts[2];
        parsed['statusMessage'] = parts[3];
    }
    return parsed;
};