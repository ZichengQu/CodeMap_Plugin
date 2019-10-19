const fs = require('fs');
const readline = require('readline');//Read file line by line;
const express = require('express');
const path = require('path');//A utility module that deals with paths.
const bodyParser = require('body-parser');
const app = express();//express contains a bunch of methods;
const open = require('open');//Open website in default browser;


//let filepath = path.join(__dirname, "CCCCC.txt")//Path of the C or C++ file
let filepath = path.join("C:\\Users\\quzic\\OneDrive\\Desktop\\CCCCC.txt")//Path of the C or C++ file

let input = fs.createReadStream(filepath)

var content = "";//The content of the C or C++ file
var lineNumber = 1;//Count numbers for lines of the content

const rl = readline.createInterface({
  input: input
});
rl.on('line', (line) => {
    content += lineNumber++ +"    "+ line+ '\n';// Add line number for the C or C++ code.
});
rl.on('close', (line) => {
  //console.log(content);
  app.use('/',express.static(path.join(__dirname,'')));
    //Allows parsing of URL-encoded forms; The extended option is set to false because there is no need to deal with any complicated objects.
    app.use(bodyParser.urlencoded({extended:false}));
    //Load HTML file via get
    app.get('/',(req,res)=>{
        res.sendFile(path.join(__dirname,'drawLine2.html'));
    });
    //Load HTML file via post
    app.post('/getContent',(req,res)=>{
        //console.log(req.body);
        res.send(content);
    });
    app.listen(3000);

    open('http://localhost:3000/');
});



    
  