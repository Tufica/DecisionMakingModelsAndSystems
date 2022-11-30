var http = require('http'),
fs = require('fs');
var fsp = require('fs/promises');
var exec = require('child_process').execFile;
const path = require("path");
const { parse } = require("csv-parse");



function serveStaticFile(res, path, contentType, responseCode) {
if(!responseCode) responseCode = 200;
fs.readFile(__dirname + path, function(err,data) {
    if(err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Internal Error');
    } else {
        res.writeHead(responseCode,
            { 'Content-Type': contentType });
        res.end(data);
    }
});
}
let client = null;
http.createServer(async function(req,res){

    const headers = {
        'Access-Control-Allow-Origin': '', // @dev First, read about security */
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        'Access-Control-Allow-Headers': 'authorization, content-type'
        /** add other headers as per requirement */
      };
      if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
      }
      
  
     
  
        
        var pa = req.url.replace(/\/?(?:\?.*)?$/, '')
        .toLowerCase();

        switch(pa) {
            case '':
                serveStaticFile(res, '/index.html', 'text/html');
                break;
            case '/eval':
                if(fs.existsSync(__dirname+"/wykres.png")){
                    fs.unlinkSync(__dirname+"/wykres.png")
                }
                    let body = [];
                    req.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('end', () => {body = Buffer.concat(body).toString()});


                   
  // at this point, body has the entire request body stored in it as a string
          

               await fsp.writeFile("input_data.txt",body).then(()=>{
                

                exec('./obliczenia', function(err, data) {

                    console.log("Obliczonwe")
    
                
                   });
                
                   exec('./main', function(err, data) {});
               })


               let exists = fs.existsSync(__dirname+"/wykres.png")
               while(!exists) {
                   exists = fs.existsSync(__dirname+"/wykres.png");
               } 
                

                console.log("done")
                break;
            case "/subscribe":
                console.log("test");
                // send headers to keep connection alive


                    res.statusCode = 200;
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Cache-Control", "no-cache");
                    res.setHeader("connection", "keep-alive");
                    res.setHeader("Content-Type", "text/event-stream");

                    // send client a simple response
                    res.write('you are subscribed');

                    
                    // store res of client to let us send events at will
                    client = res;

                    // listen for client 'close' requests
                    req.on('close', () => { client = null; });
                    
                    

                    break;
                            
            case "/wykres.png":
              
 
                // Extracting the path of file
             
                // Path Refinements
                
                filePath = __dirname+pa;

                // var filePath = path.join(__dirname,
                //         action).split("%20").join(" ");

                fs.exists(filePath, function (exists) {
 
                    if (!exists) {
                        res.writeHead(404, {
                            "Content-Type": "text/plain" });
                        res.end("404 Not Found");
                        return;
                    }
             
                    // Extracting file extension
                    var ext = path.extname(pa);
             
                    // Setting default Content-Type
                    var contentType = "text/plain";
             
                    // Checking if the extension of
                    // image is '.png'
                    if (ext === ".png") {
                        contentType = "image/png";
                    }
             
                    // Setting the headers
                    res.writeHead(200, {
                        "Content-Type": contentType });
             
                    // Reading the file
                    fs.readFile(filePath,
                        function (err, content) {
                            // Serving the image
                            res.end(content);
                        });
                });

                break;
        case '/tabela':
            
            
           if( fs.existsSync("./results.txt") && fs.existsSync("./data_Htable.txt")){

            

            let lines =  fs.readFileSync('./results.txt', 'utf-8');

            lines ='<div class="result">' +lines.split("\n").map(x => "<br>"+x+"</br>" ).join("") + "</div>"
                
            
              
              let rows = []

             fs.createReadStream("./data_Htable.txt")
            .pipe(parse({ delimiter: " ", from_line: 1 }))
            .on("data", function (row) {
                rows.push(row);
            }).on("end", function () {
                
            let index = rows.shift();

            index = "<tr>\n" + index.map((x)=>`<th>${x}</th>`).join('\n') + "</tr>\n" ;
            
            rows = rows.map(x=>{
                return "<tr>\n" + x.map((y)=>`<td>${y}</td>`).join('\n') + "\n</tr>\n " 
            }).join('\n');


            let table = lines+'\n<table> \n' + index + rows + '</table> \n';
            
            res.writeHead(200);

                res.write(table);
                res.end();
            
            
              }).on("error", function () {
                res.writeHead(404, {
                    "Content-Type": "text/json" });
    
                    res.write("no data");
                    res.end();
                
              })

           }else{
            res.writeHead(404, {
                "Content-Type": "text/json" });

                res.write("no data");
                res.end();
            
           }




        break;



// normalize url by removing querystring, optional
// trailing slash, and making lowercase

}}).listen(3000);

console.log('Server started on localhost:3000; press Ctrl-C to terminate....');