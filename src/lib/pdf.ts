import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PdfLoadingError } from "./utils/errors.js";
import { Document } from "langchain/document";

export async function tokenizePDF(
  filePath: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<Document[]> {
  try {
    // Load the PDF
    const pdfLoader = new PDFLoader(filePath);
    const document = await pdfLoader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });
    return await splitter.splitDocuments(document);
  } catch (error: any) {
    console.error("Error tokenizing PDF:", error);
    if (error instanceof Error) {
      throw new PdfLoadingError(error.message);
    } else
      throw new PdfLoadingError(
        `An error occurred while loading the PDF file at ${filePath}`
      );
  }
}
