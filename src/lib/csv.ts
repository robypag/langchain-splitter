import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { CsvLoadingError } from "./utils/errors.js";
import { Document } from "langchain/document";

export async function tokenizeCsvFile(
  filePath: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<Document[]> {
  try {
    // Read the file
    const textLoader = new CSVLoader(filePath);
    const document = await textLoader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });
    return await splitter.splitDocuments(document);
  } catch (error: any) {
    console.error("Error tokenizing file:", error);
    if (error instanceof Error) {
        throw new CsvLoadingError(error.message);
    } else throw new CsvLoadingError(`An error occurred while loading the file at ${filePath}`);
  }
}
