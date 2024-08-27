import * as mammoth from "mammoth";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadFile } from "./utils/index.js";
import { WordLoadingError } from "./utils/errors.js";

export async function tokenizeWordDocument(
  filePath: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<string[]> {
  try {
    // Step 1: Read the Word document
    const buffer = (await loadFile(filePath)) as Buffer;

    // Step 2: Convert the Word document to plain text
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;

    // Step 3: Create a Document object
    const doc = new Document({ pageContent: text });

    // Step 4: Initialize the text splitter
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });

    // Step 5: Split the document into chunks
    const splitDocs = await textSplitter.splitDocuments([doc]);

    // Step 6: Extract tokens from the split documents
    const tokens = splitDocs.flatMap((doc) => doc.pageContent.split(/\s+/));

    return tokens;
  } catch (error) {
    console.error("Error tokenizing Word document:", error);
    if (error instanceof Error) {
      throw new WordLoadingError(error.message);
    } else
      throw new WordLoadingError(
        `An error occurred while loading the PDF file at ${filePath}`
      );
  }
}
