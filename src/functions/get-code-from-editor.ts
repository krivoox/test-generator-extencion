import * as vscode from 'vscode';

/**
 * Obtiene el código del editor activo.
 * @returns El código del editor o null si no hay editor activo.
 */
export function getCodeFromEditor(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null; // No hay editor activo
  }
  return editor.document.getText(); // obtengo el código del editor
}
