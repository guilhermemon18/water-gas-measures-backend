import fs from "fs";
import path from "path";

export function base64ToImage(
  base64String: string,
  outputPath: string,
): string {
  // Remover o prefixo do Base64, se houver (ex: "data:image/jpeg;base64,")
  const matches = base64String.match(/^data:(.*);base64,(.*)$/);
  let data = base64String;
  let mimeType: string = "image/jpeg";
  if (matches) {
    mimeType = matches[1];
    data = matches[2];
  }

  // Decodificar a string Base64
  const imageBuffer = Buffer.from(data, "base64");

  // Determinar a extensão com base no MIME type
  let extension = "";
  switch (mimeType) {
    case "image/png":
      extension = ".png";
      break;
    case "image/jpeg":
      extension = ".jpeg";
      break;
    case "image/webp":
      extension = ".webp";
      break;
    case "image/heic":
      extension = ".heic";
      break;
    case "image/heif":
      extension = ".heif";
      break;
    default:
      throw new Error("Unsupported image MIME type");
  }

  // Definir o caminho completo do arquivo de saída
  const filePath = path.join(outputPath, `output${extension}`);

  // Escrever o arquivo de imagem
  fs.writeFileSync(filePath, imageBuffer);

  console.log(`Imagem salva em: ${filePath}`);
  return filePath;
}

