import { promises as fs } from "fs";

async function lerArquivo(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Erro ao ler o arquivo:", err);
    throw err;
  }
}
