const http = require('http');
const port = 3000;
const url = require('url');
const fs = require('fs');
// const queryString = require('querystring')
const {MongoClient} = require('mongodb');
const Client = new MongoClient('mongodb://localhost:27017');

async function connect(){
    try{

        await Client.connect();
        console.log("Database connection established...");

    }catch (error){
        console.log("error : ",error);
    }
}
connect();

const server = http.createServer(async(req, res)=>{
    let db= Client.db("dms");
    let collection=db.collection("users");
    const req_url = req.url;
    console.log("req_url : ",req_url);

    const parsed_url = url.parse(req_url);
    console.log("parsed_url : ",parsed_url);

    if(parsed_url.pathname === '/'){
        
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(fs.readFileSync('../client/index.html'));

    }else if(parsed_url.pathname === '/style.css'){
        res.writeHead(200, {'Content-Type' : 'text/css'});
        res.end(fs.readFileSync('../client/style.css'));

    }else if (parsed_url.pathname === '/test'){
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end('test successful');

    }else if(parsed_url.pathname === '/anitta'){
        res.writeHead(299,{'Content-Type':'text/json'});
        res.end(fs.readFileSync('../server/datas.json'))
    }else if(parsed_url.pathname === '/adduser.html'){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(fs.readFileSync('../client/adduser.html'));

    }else if(parsed_url.pathname === '/add.js'){
        res.writeHead(200,{'Content_Type' : 'text/javascript'})
        res.end(fs.readFileSync('../client/add.js'));
    }
    else if(parsed_url.pathname === '/submit' && req.method === 'POST'){
        console.log("Reached here.....");

        let body = '';

        req.on('data',(chunks)=>{
            console.log("chunks : ",chunks);
            body += chunks.toString();
        });

        req.on('end' , ()=>{
            console.log("body : ", body);

            let datas = JSON.parse(body);
            console.log("datas : ", datas);

            console.log("name : ", datas.name);
            console.log("email : ", datas.email);
            console.log("password: ", datas.password);
            collection.insertOne({
                name : datas.name,
                email : datas.email,
                password : datas.password,
            })
            .then((message) => {
                console.log("message : ",message);
                res.writeHead(201,{'content_type' : "text/plain"});
                res.end("User created successfully");
            })
            .catch((error) => {
                console.log("error : ",error);
    
                res.writeHead(400, {'content_type' : "text/plain"});
                res.end(error.message ? error.message : "User creation failed");
            })
        })
      
    }else if(parsed_url.pathname === '/submit' && req.method === 'GET'){

        let UserDatas = await collection.find().toArray();
        console.log("UserDatas : ",UserDatas)

        let json_Datas=JSON.stringify(UserDatas);
        console.log("json_Datas : ",json_Datas);

        res.writeHead(200,{'Content_Type': "text/json"});
        res.end(json_Datas);
    }
    // }else if(parsed_url.pathname === '/submit' && req.method === 'GET'){
    //     let body;
    //     req.on('data',("chunk ",chunk)=>{
    //         console.log("chunk :",chunk);
    //         body=chunk.toString
    //     });
    // }

})
server.listen(port, () =>{
    console.log(`server running at http://localhost:${port}`)
});
