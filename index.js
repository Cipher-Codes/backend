const http = require('http');
const url = require('url')
const fs = require('fs')
const cors = require('cors'); 
const sqlite3 = require('sqlite3').verbose();
const dataUrl = './data/data.json'

const dbPath = './data/data.db'


const corsOptions = {
    origin: '*', // Replace with your client-side origin
    // methods: 'POST', // Allow POST method
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
};

const dbPathTwo = './data/datatwo.db'


const db = new sqlite3.Database(dbPathTwo, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        // Handle error appropriately
    }
});

//create a server object:
const server = http.createServer(function (req, res) {

const parsedUrl = url.parse(req.url, true);
const queryParameters = parsedUrl.query;
 
if(parsedUrl.pathname == '/setdata'){
    
    // let array2 = []
    // for (a in queryParameters) {
    //     console.log(a)
    // }
    // console.log("HI : "+array2[1])
    

    fs.writeFile(dataUrl, JSON.stringify(array), 'utf-8', (err) => {
        console.log(err)
    })
    res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', "access-control-allow-headers" : '*'}); // http header
    res.write(JSON.stringify(queryParameters)); 
    res.end();
}

else if(parsedUrl.pathname == '/getdata'){
    fs.readFile(dataUrl, 'utf-8', (err, data) => {
        if(!err){
            res.writeHead(200, {'Content-Type': 'application/json','access-control-allow-origin' : '*', "access-control-allow-headers" : '*'}); // http header
            res.write(data); 
            res.end();
        }else{
            res.writeHead(400, {'Content-Type': 'text/html','access-control-allow-origin' : '*', "access-control-allow-headers" : '*'}); // http header
            res.write('error'); 
            res.end();
            console.log(err);
        }
    })
    
}

else if(parsedUrl.pathname == "/createtable"){
    db.run('CREATE TABLE IF NOT EXISTS transactions (id INTEGER Primary Key AUTOINCREMENT, name TEXT NULL, age INTEGER , amount INTEGER, tcid INTEGER, source TEXT NULL, destination TEXT NULL)', (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            // Handle error gracefully
        } else {
            console.log('Table created (if it did not exist)');
            res.end("Table Created")
        }
    });
}

else if(parsedUrl.pathname == "/adddata" && req.method == "POST"){
    db.run('insert into transactions  (name,age,amount,tcid,source,destination) values (?,?,?,?,?,?)', [queryParameters.name,queryParameters.age,queryParameters.amount,queryParameters.tcid,queryParameters.source,queryParameters.destination], (err) => {
        if(err){
            console.log("Error",err.message)
        }else{
            res.writeHead(200,{'Content-Type' : 'application/json' , 'Access-Control-Allow-Origin': 'http://localhost:4200',
            'Access-Control-Allow-Methods': 'POST', // Adjust as needed
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'})
            res.end({"message" : "Inserted"})
        }
    });
    
}

else if(parsedUrl.pathname == "/data"){

    db.all('select * from transactions', (err, row) => {
        if (err) {
            console.error('Error creating table:', err.message);
            // Handle error gracefully
        } else {
            res.writeHead(200, {'Content-Type': 'application/json','access-control-allow-origin' : '*', "access-control-allow-headers" : '*'})
            res.write(JSON.stringify(row));
            res.end();
        }
    });
}

else if(parsedUrl.pathname == "/droptable"){
    db.run('drop table if exists trasanctions', (err) => {
        if(err){
            console.log('Error droping table', err.message);
        }else{
            res.end("Dropped")
        }
    })
}


else if(parsedUrl.pathname == "/alter"){
    db.run('ALTER TABLE transactions MODIFY name TEXT;', (err) => {
        if(err){
            console.log(err.message);
        }
        else{
            res.end("Succeeded")
        }
    })
    
}

else{
    res.writeHead(200, {'Content-Type': 'text/html'}); // http header
   res.write('end'); 
   res.end();
}
 

})



function fetchAll(){
    db.all('select * from users', (err, row) => {
        if (err) {
            console.error('Error creating table:', err.message);
            // Handle error gracefully
        } else {
            console.log("Row : "+row)
            return row;
        }
    });
}



function createTable(){
    db.run('CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, age INTEGER, amount INTEGER, tcid INTEGER, source TEXT, destination TEXT )', (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            // Handle error gracefully
        } else {
            console.log('Table created (if it did not exist)');
        }
    });
}



server.listen(3000, function(){
 console.log("server start at port 3000"); 
});
