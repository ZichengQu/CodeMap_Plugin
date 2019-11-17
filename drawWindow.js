const fs = require('fs');
const readline = require('readline');//Read file line by line;
const express = require('express');
const path = require('path');//A utility module that deals with paths.
const bodyParser = require('body-parser');
const app = express();//express contains a bunch of methods;
const open = require('open');//Open website in default browser;

var errorObj;
var errorMap = new Map();//make FilePath as key, Lines as value.
fs.readFile('test.json','utf8',function (err, data) {
  if(err) console.log(err);
  errorObj = eval("("+data+")");//convert json to js object

  for(var i=0; i<errorObj.ErrorMessages.length; i++){
    var key = errorObj.ErrorMessages[i].FilePath;//Key.
    var position = errorObj.ErrorMessages[i].Position;//Points in Lines.
    var errorContent = errorObj.ErrorMessages[i].ErrorContent;
    console.log(key + " " + position.row + " " + errorContent);
    var errorDetail = [{
        errPos: position,
        errCon: errorContent
    }]
    if (errorMap.has(key)) {//if the key is same, original value should plus new value.
      var oriError = errorMap.get(key);
      var errorSplit = [{errPos: " ", errCon: " "}];
      var errors = (oriError.concat(errorSplit)).concat(position);
      errorMap.set(key, errors);
    }else{
      errorMap.set(key, errorDetail);
    }
  }

  for (var [key, value] of errorMap) {
    //console.log(key + ' = ' + value.errPos);//console log test
    drawWindow(key,value);
  }
});

var flag = true;

function drawWindow(key, value){
  let filepath = path.join(key)//Path of the C or C++ file
  let input = fs.createReadStream(filepath)

  var content = "";//The content of the C or C++ file
  var lineNumber = 1;//Count numbers for lines of the content
  var rl = readline.createInterface({
    input: input
  });
  rl.on('line', (line) => {
    var space = "";
      if(lineNumber<=9){
        space = "    ";
      }else{
        space = "   ";
      }
      content += lineNumber++ +space+ line+ '\n';// Add line number for the C or C++ code.
  });
  rl.on('close', (line) => {
    var totalPoints = [{content:content}].concat(value);//Add the target file content into the value.
    errorMap.set(key,totalPoints);
    //console.log(pointMap.get(key)[0].content);//Test the forEach content 
    
    app.use('/',express.static(path.join(__dirname,'')));
    //Allows parsing of URL-encoded forms; The extended option is set to false because there is no need to deal with any complicated objects.
    app.use(bodyParser.urlencoded({extended:false}));
    //Load HTML file via get
    app.get('/',(req,res)=>{
        res.sendFile(path.join(__dirname,'drawLine2.html'));
    });
    //Load HTML file via post
    app.post('/getContent',(req,res)=>{
        //console.log(req.body.fileName);//The file name
        var key = req.body.fileName;
        //console.log(pointMap.get(key));
        res.send(errorMap.get(key));
    });
    if(flag){
      app.listen(3000);
      flag = false;
    }
    open('http://localhost:3000/drawLine2.html?mapKey='+key);

  });
}