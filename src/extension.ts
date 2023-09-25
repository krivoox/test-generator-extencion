import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.gentest', () => {
    vscode.window.showInformationMessage(
      'Hello World from test-generator-extencion!'
    );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
