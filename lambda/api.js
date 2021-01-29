const AWS = require('aws-sdk');
const https = require("https");
const querystring = require('querystring');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };
    
    try {
        switch (event.httpMethod) {
            case 'DELETE':
                body = JSON.parse({"status":"delete success"});
                break;
            case 'GET':
                body = {"status":"get success"};
                break;
            case 'POST':
                body = {"status":"post success"};
                //console.log("bodyだけほしい↓");
                //console.log(event.body);
                //console.log("bodyだけほしい↑");
                //ここからスプシに投稿するコード
        
                const json = JSON.parse(event.body);
                console.log("名前とIdをスプシに登録");
                console.log(json.events[0].message.text);
                console.log(json.events[0].source.userId);
                
                var postMessage = {
                    'text': json.events[0].message.text,
                    'timestamp': json.events[0].timestamp,
                    'userId': json.events[0].source.userId
                }
                
                console.log("postMessage↓");
                console.log(postMessage);
                console.log("postMessage↑");
                var string = JSON.stringify(postMessage);

                var postDataStr = JSON.stringify(postMessage);
                console.log("postData↓");
                console.log(postDataStr);
                console.log("postData↑");
                let options = {
                    host: 'script.google.com',
                    path: '/macros/s/AKfycbyxKlLqautpWT8WSdt5VPC90gQsAirKYGGPYLBnn6U3bNmivEc/exec',
                    port: 443,
                    method: 'POST',
                    headers: {
                                    'Content-Type': 'application/json',
                                    'Content-Length': Buffer.byteLength(postDataStr)
                    }
                };
                var post_req = https.request(options, function(res) {
                    console.log("https requested")
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                      console.log('Response: ' + chunk);
                      context.succeed();
                    });
                    res.on('error', function (e) {
                    console.log("Got error: " + e.message);
                    context.done(null, 'FAILURE');
                    });
                 });
                post_req.write(postDataStr);
                post_req.end();
                //ここまでスプシに投稿するコード
                
                break;
            case 'PUT':
                body = JSON.parse({"status":"put success"});
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

