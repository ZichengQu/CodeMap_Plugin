const fs = require('fs');
const readline = require('readline');//Read file line by line;
const express = require('express');
const path = require('path');//A utility module that deals with paths.
const bodyParser = require('body-parser');
const app = express();//express contains a bunch of methods;
const open = require('open');//Open website in default browser;

var pointObj;
var pointMap = new Map();//make FilePath as key, Lines as value.
fs.readFile('/home/zichengqu/Desktop/CodeMapPlugin/test.json','utf8',function (err, data) {
  if(err) console.log(err);
  pointObj = eval("("+data+")");//convert json to js object

  //console.log(pointObj.DrawLines);//输出从json转换成obj的对象

  for(var i=0; i<pointObj.DrawLines.length; i++){
    var key = pointObj.DrawLines[i].FilePath;//Key.
    var points = pointObj.DrawLines[i].Lines;//Points in Lines.
    if(pointMap.has(key)){//if the key is same, original value should plus new value.
      var oriPoints = pointMap.get(key);
      var pointSplit = [{row: -1, colum: -1}];//use (-1,-1) as the separator between the different lines
      var totalPoints = (oriPoints.concat(pointSplit)).concat(points);
      pointMap.set(key,totalPoints);
    }else{
      pointMap.set(key,points);
    }
  }

  //console.log(pointMap);
  for (var [key, value] of pointMap) {
    //console.log(key + ' = ' + value[0].row);//输出测试
    drawLine(key,value);
  }
});

var flag = true;
function drawLine(key, value){
  let filepath = path.join(key)//Path of the C or C++ file
  let input = fs.createReadStream(filepath)

  var content = "";//The content of the C or C++ file
  var lineNumber = 1;//Count numbers for lines of the content

  var rl = readline.createInterface({
    input: input
  });
  rl.on('line', (line) => {
      content += lineNumber++ +"    "+ line+ '\n';// Add line number for the C or C++ code.
  });
  rl.on('close', (line) => {
    
    var totalPoints = [{content:content}].concat(value);//Add the target file content into the value.
    pointMap.set(key,totalPoints);
    //console.log(pointMap.get(key)[0].content);//测试当前循环下的test1或test2的content
    
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
        res.send(pointMap.get(key));
    });
    if(flag){
      app.listen(3000);
      flag = false;
    }
    open('http://localhost:3000/drawLine2.html?mapKey='+key);

  });
}