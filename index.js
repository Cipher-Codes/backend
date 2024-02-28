var http = require('http');
var url = require('url')
var fs = require('fs')

var dataUrl = './data/data.json'

//create a server object:
http.createServer(function (req, res) {

const parsedUrl = url.parse(req.url, true);
const queryParameters = parsedUrl.query;
 
if(parsedUrl.pathname == '/setdata'){

    fs.appendFile(dataUrl, JSON.stringify(queryParameters), 'utf-8', (err) => {
        console.log(err)
    })
    res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'}); // http header
    res.write("Success"); 
    console.log(parsedUrl.pathname)
    res.end();
}

else if(parsedUrl.pathname == '/getdata'){
    fs.readFile(dataUrl, 'utf-8', (err, data) => {
        if(!err){
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'}); // http header
            res.write(data); 
            res.end();
        }else{
            console.log(err);
        }
    })
    
}

else{
    res.writeHead(200, {'Content-Type': 'text/html'}); // http header
   res.write('end'); 
   res.end();
}
 

}).listen(3000, function(){
 console.log("server start at port 3000"); 
});