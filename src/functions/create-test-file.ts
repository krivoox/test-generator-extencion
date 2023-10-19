import * as fs from 'fs';
import * as path from 'path';

/**
 * Crea un archivo de test con el contenido proporcionado.
 * @param testFilePath La ruta donde se creará el archivo de test.
 * @param content El contenido del test.
 */
export function createTestFile(testFilePath: string, content: string): void {
  // Verifica si el archivo ya existe
  if (fs.existsSync(testFilePath)) {
    throw new Error(`The file ${path.basename(testFilePath)} already exists.`);
  }
  // Crea el archivo
  fs.writeFileSync(testFilePath, content);
}
