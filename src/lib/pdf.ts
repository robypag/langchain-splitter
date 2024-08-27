import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PdfLoadingError } from "./utils/errors.js";

export async function tokenizePDF(
  filePath: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<string[]> {
  try {
    // Load the PDF
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    // Combine all pages into a single string
    const fullText = docs.map((doc) => doc.pageContent).join(" ");

    // Create a text splitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });

    // Split the text into tokens
    const tokens = await splitter.splitText(fullText);

    return tokens;
  } catch (error: any) {
    console.error("Error tokenizing PDF:", error);
    if (error instanceof Error) {
        throw new PdfLoadingError(error.message);
    } else throw new PdfLoadingError(`An error occurred while loading the PDF file at ${filePath}`);
  }
}
