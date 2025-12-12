export function generateUniqueCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 4;
  let result = "";
  for (let i = 0; i < codeLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const unique_code = "OYO" + result;
  return unique_code;
}
