import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadFile } from './utils/index.js';
import { TextLoadingError } from "./utils/errors.js";

export async function tokenizePlaintextFile(
  filePath: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<string[]> {
  try {
    // Read the file
    const text = await loadFile(filePath, "utf-8") as string;

    // Create a RecursiveCharacterTextSplitter instance
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });

    // Split the text into tokens
    const output = await splitter.createDocuments([text]);

    // Extract the page content from each document
    return output.map((doc) => doc.pageContent);
  } catch (error: any) {
    console.error("Error tokenizing file:", error);
    if (error instanceof Error) {
        throw new TextLoadingError(error.message);
    } else throw new TextLoadingError(`An error occurred while loading the file at ${filePath}`);
  }
}
