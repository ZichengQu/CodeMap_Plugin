const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 * Input the HoverProvider file absolute path in the Setting>>Extensions or modify the default in package.json
 */
module.exports = function(context) {
    
    const language = ['json','javascript','typescript'];//listen to files of the specific languages

    //Register a mouse hover prompt
    context.subscriptions.push(vscode.languages.registerHoverProvider(language, {
        provideHover
    }));

};

function provideHover(document, position, token) {
    const fileName    = document.fileName;
    const workDir     = path.dirname(fileName);
    const keyword     = document.getText(document.getWordRangeAtPosition(position));
    
    //Get the HoverProvider file content
    var key = 'CodeMapPlugin.HoverProvider';
    var filePath = vscode.workspace.getConfiguration().get(key);
    if(filePath==null||filePath==undefined||filePath==''){
        vscode.window.showInformationMessage("Please input the HoverProvider file absolute path in the Setting>>Extensions");
        return null;
    }
    const fileContentArr = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);//Push content into Array
    console.log(fileContentArr);

    var hoverContent;
    for(var i=0;i<fileContentArr.length;i++){
        if(fileContentArr[i].split(":")[0]=="www"){//use "keyword" instead of "www" later, "www" is just used for test.
            hoverContent = fileContentArr[i].split(":")[1];//Get hover content
        }
    }
    console.log(hoverContent);
    return new vscode.Hover(hoverContent);//Show hover message
}