import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import { base64ToImage } from "../utils/convertImage";

export async function teste() {
  // Garantir que a chave de API não seja undefined
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(process.env.GEMINI_API_KEY);

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY não foi definida nas variáveis de ambiente."
    );
  }

  // Access your API key as an environment variable
  const genAI = new GoogleGenerativeAI(apiKey);

  // To use the File API, add this import path for GoogleAIFileManager.
  // Note that this is a different import path than what you use for generating content.
  // For versions lower than @google/generative-ai@0.13.0
  // use "@google/generative-ai/files"

  // Initialize GoogleAIFileManager with your API_KEY.
  const fileManager = new GoogleAIFileManager(apiKey);

  // Upload the file and specify a display name.
  const uploadResponse = await fileManager.uploadFile(
    "resource\\img\\hidrometro.jpeg",
    {
      mimeType: "image/jpeg",
      displayName: "Jetpack drawing",
    }
  );

  console.log("api arquivo gemini:", process.env.GEMINI_API_KEY);

  // View the response.
  console.log(
    `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
  );

  // Get the previously uploaded file's metadata.
  const getResponse = await fileManager.getFile(uploadResponse.file.name);

  // View the response.
  console.log(
    `Retrieved file ${getResponse.displayName} as ${getResponse.uri}`
  );

  const model = genAI.getGenerativeModel({
    // Choose a Gemini model.
    model: "gemini-1.5-flash",
  });

  // Upload file ...

  // Generate content using text and the URI reference for the uploaded file.
  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    { text: "Retorne a medição do hidrômetro (apenas números)." },
  ]);

  // Output the generated text to the console
  console.log(result.response.text());

  // Converts local file information to a GoogleGenerativeAI.Part object.
  function fileToGenerativePart(path: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }

  // Turn images to Part objects
  const filePart1 = fileToGenerativePart(
    "resource\\img\\jetpack.jpg",
    "image/jpeg"
  );
  const filePart2 = fileToGenerativePart(
    "resource\\img\\piranha.jpg",
    "image/jpeg"
  );
  const filePart3 = fileToGenerativePart(
    "resource\\img\\firefighter.jpg",
    "image/jpeg"
  );

  // console.log(filePart1, filePart2, filePart3);

  const prompt = "descreva a imagem.";

  const imageParts = [filePart1, filePart2, filePart3];

  // Turn images to Part objects
  const arara = fileToGenerativePart("resource\\img\\arara.jpg", "image/jpeg");

  // const arara = [{
  //   inlineData: {
  //     data: "oi",
  //     mimeType: "image/png"
  //   },
  // }]

  const generatedContent = await model.generateContent([prompt, arara]);

  console.log(generatedContent.response.text());

  return {
    image_url: uploadResponse.file.uri,
    measure_value: result.response.text(),
  };
}

export async function getMeasureByGemini(
  image64: string
): Promise<{ image_url: string; measure_value: number }> {
  const imageFileName: string = base64ToImage(
    image64,
    "resource/img"
  );

  // Garantir que a chave de API não seja undefined
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(process.env.GEMINI_API_KEY);

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY não foi definida nas variáveis de ambiente."
    );
  }

  // Access your API key as an environment variable
  const genAI = new GoogleGenerativeAI(apiKey);

  // To use the File API, add this import path for GoogleAIFileManager.
  // Note that this is a different import path than what you use for generating content.
  // For versions lower than @google/generative-ai@0.13.0
  // use "@google/generative-ai/files"

  // Initialize GoogleAIFileManager with your API_KEY.
  const fileManager = new GoogleAIFileManager(apiKey);

  // Upload the file and specify a display name.
  const uploadResponse = await fileManager.uploadFile(imageFileName, {
    mimeType: "image/" + imageFileName.split('.')[1],
    displayName: "Hidrômetro",
  });

  console.log("api arquivo gemini:", process.env.GEMINI_API_KEY);

  // View the response.
  console.log(
    `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
  );

  // Get the previously uploaded file's metadata.
  const getResponse = await fileManager.getFile(uploadResponse.file.name);

  // View the response.
  console.log(
    `Retrieved file ${getResponse.displayName} as ${getResponse.uri}`
  );

  const model = genAI.getGenerativeModel({
    // Choose a Gemini model.
    model: "gemini-1.5-flash",
  });

  // Upload file ...

  // Generate content using text and the URI reference for the uploaded file.
  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    { text: "Retorne a medição dos números no hidrômetro (apenas números)." },
  ]);

  // Output the generated text to the console
  console.log(result.response.text());

  return {
    image_url: uploadResponse.file.uri,
    measure_value: Number.parseInt(result.response.text()),
  };
}
