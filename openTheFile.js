const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 * This method is to open the target file via 'Command Palette', the command is 'Open Target File' and the keybinding is 'ctrl + i' or 'cmd+i'.
 * When the 'contralmarks.json' file is closed, the change listening will not work in 'openFile.js' file, so the command above should be used to open the target file.
 */
module.exports =function (context) {
	//console.log('Congratulations, your extension "openfile" is now active!');
	let disposable = vscode.commands.registerCommand('extension.openTheFile', function() {
        var path = context.extensionPath;
        path = path.split("/.local")[0]+'/WORKSPACE/bullet-2.81-rev2613-code-map-test/.vscode/contralmarks.json';//This is the absolute path of 'contralmarks.json' file.
        vscode.window.showTextDocument(vscode.Uri.file(path)).then(editor => {
            const content = editor.document.getText();//Get the content of the 'contralmarks.json' file.
            var rex1 = '(?<="fsPath":").*?(?=","line":")';//Use regular expressions to get the path of the file to be opened.
            var rex2 = '(?<=","line":").*?(?=","character")';//Use regular expressions to get the line number of the file to be opened.
            var path = content.match(rex1)[0];//Absolute path of the file to be opened.
            var line = parseInt(content.match(rex2)[0])-1;//The line the cursor would be set.
            console.log(path);
            console.log(line);
            const options = {
                selection: new vscode.Range(new vscode.Position(isNaN(line)?0:line, 0), new vscode.Position(isNaN(line)?0:line, 0)),//Select some text or where the cursor will be placed.
                preview: false,// Preview, default true, preview means that next time you open another file in vscode, you will replace the current file
                viewColumn: vscode.ViewColumn.One// Displays in which editor
            };
            vscode.window.showTextDocument(vscode.Uri.file(path), options);//Open the target file and set cursor at a fixed line.
        });
    });
    
	context.subscriptions.push(disposable);
}
