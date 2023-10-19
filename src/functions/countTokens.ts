/**
 * Cuenta los tokens en el texto proporcionado.
 * Esta es una aproximación simple basada en caracteres.
 * Para un conteo preciso, se necesitaría una función más compleja.
 * @param text El texto para contar los tokens.
 * @returns El número aproximado de tokens.
 */
function countTokens(text: string): number {
  const tokens = text.split(/\s+|(?=\p{P})|(?<=\p{P})/gu);
  return tokens.length;
}
