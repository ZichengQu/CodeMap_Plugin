const vscode = require('vscode');
const path = require('path');
/**
 * @param {vscode.ExtensionContext} context
 * This method is to listen the 'contralmarks.json' file. It will open the target file and corresponding line when changes in the 'contralmarks.json' file.
 */
module.exports = function(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.openFile', function () {
    //var path = context.extensionPath;
    //path = path.split("/.local")[0]+'/WORKSPACE/bullet-2.81-rev2613-code-map-test/.vscode/contralmarks.json';//This is the absolute path of 'contralmarks.json' file.
    var vsrootPath = vscode.workspace.rootPath;
    var vscodefile = path.join(vsrootPath,".vscode");
    var markPath = path.join(vscodefile,"contralmarks.json");
    let onChange = vscode.workspace.onDidChangeTextDocument((e) => {//Listen for any changes in any opened file
      //console.log("onDidChangeTextDocument executed!!!");
      
      if(e.document.fileName == markPath){//Execute the following actions only when the contents of the 'contralmarks.json' file change 
        vscode.window.showTextDocument(vscode.Uri.file(markPath)).then(editor => {
          const content = editor.document.getText();//Get the content of the 'contralmarks.json' file.
          var rex1 = '(?<="fsPath":").*?(?=","line":")';//Use regular expressions to get the path of the file to be opened.
          var rex2 = '(?<=","line":").*?(?=","character")';//Use regular expressions to get the line number of the file to be opened.
          var markPath = content.match(rex1)[0];//Absolute path of the file to be opened.
          var line = parseInt(content.match(rex2)[0])-1;//The line the cursor would be set.
          if(markPath!=null&&line!=null){
            const options = {
              selection: new vscode.Range(new vscode.Position(isNaN(line)?0:line, 0), new vscode.Position(isNaN(line)?0:line, 0)),//Select some text or where the cursor will be placed.
              preview: false,// Preview, default true, preview means that next time you open another file in vscode, you will replace the current file
              viewColumn: vscode.ViewColumn.One// Displays in which editor
            };
            vscode.window.showTextDocument(vscode.Uri.file(markPath), options);//Open the target file and set cursor at a fixed line.
          }
       });
      }
    });

    context.subscriptions.push(onChange);
  }));

  vscode.commands.executeCommand('extension.openFile');
};