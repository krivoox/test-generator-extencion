import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import OpenAI from 'openai';

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('openaiTestGenerator');
  const apiKey = config.get<string>('apiKey');

  if (!apiKey) {
    vscode.window.showErrorMessage(
      'Please configure the OpenAI API Key in settings.'
    );
    return;
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  let generateTest = vscode.commands.registerCommand(
    'extension.gentest',
    async (fileUri: vscode.Uri) => {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'generating tests...',
          cancellable: false,
        },
        async () => {
          if (fileUri && fileUri.fsPath) {
            const filePath = fileUri.fsPath;
            const fileDir = path.dirname(filePath);
            const fileNameWithoutExt = path.basename(
              filePath,
              path.extname(filePath)
            );
            const testFileName = `${fileNameWithoutExt}.test${path.extname(
              filePath
            )}`;
            const testFilePath = path.join(fileDir, testFileName);

            // Verifica si el archivo ya existe
            if (fs.existsSync(testFilePath)) {
              vscode.window.showErrorMessage(
                `The file ${testFileName} already exists.`
              );
              return;
            }

            const editor = vscode.window.activeTextEditor;

            if (!editor) {
              return; // No hay editor activo
            }

            const code = editor.document.getText(); // obtengo el codigo del editor
            let responseAi;

            try {
              responseAi = await openai.chat.completions.create({
                messages: [
                  {
                    role: 'user',
                    content: `Given the following react component typecript, generate a unit test using the selected test library (jest). It considers the most relevant cases based on the code logic and detects possible errors to be included in the tests: \n${code} \n Note: Returns only the test code.`,
                  },
                ],
                model: 'gpt-3.5-turbo',
                max_tokens: 500,
                temperature: 0.5, // Balance entre creatividad y determinismo
                top_p: 0.9, // Probabilidad de que el resultado sea el mejor posible
                frequency_penalty: 0,
                presence_penalty: 0,
              });
            } catch (error: any) {
              vscode.window.showErrorMessage(
                'Error generating test: ' + error.message
              );
              return;
            }

            const unitTestResponse = responseAi.choices[0].message.content;

            // Crea el archivo
            fs.writeFileSync(testFilePath, unitTestResponse || ''); // Puedes añadir contenido inicial si lo deseas
            vscode.window.showInformationMessage(
              `File ${testFileName} successfully created.`
            );

            // Opcional: Abre el archivo en el editor
            const testFileUri = vscode.Uri.file(testFilePath);
            vscode.workspace.openTextDocument(testFileUri).then((doc) => {
              vscode.window.showTextDocument(doc);
            });

            vscode.window.showInformationMessage('¡Proceso completado!');
          }
        }
      );
    }
  );

  context.subscriptions.push(generateTest);
}

export function deactivate() {}
