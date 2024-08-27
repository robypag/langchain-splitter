import { Document } from "langchain/document";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PowerpointLoadingError } from "./utils/errors.js";

export async function tokenizePowerpointDocument(
  filePath: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<Document[]> {
  try {
    // Step 1: Read the Word document
    const pptxBuffer = new PPTXLoader(filePath);
    const document = await pptxBuffer.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });
    return await splitter.splitDocuments(document);
  } catch (error) {
    console.error("Error tokenizing Powerpoint document:", error);
    if (error instanceof Error) {
      throw new PowerpointLoadingError(error.message);
    } else
      throw new PowerpointLoadingError(
        `An error occurred while loading the Powerpoint file at ${filePath}`
      );
  }
}
