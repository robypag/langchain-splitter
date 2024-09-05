import { tokenizePDF } from "./lib/pdf.js";
import { tokenizePlaintextFile } from "./lib/plaintext.js";
import { removeTempFile, writeTempFile } from "./lib/utils/index.js";
import {
  UnrecognizableFileType,
  UnsupportedFileType,
} from "./lib/utils/errors.js";
import { tokenizeWordDocument } from "./lib/word.js";
import { lookup } from "mime-types";
import { Document } from "langchain/document";
import { tokenizeCsvFile } from "./lib/csv.js";
import { Readable } from "node:stream";
import { tokenizePowerpointDocument } from "./lib/powerpoint.js";

export interface DocumentChunk {
  id?: string | undefined;
  metadata: Record<string, any>;
  content: string;
}

export type TokenizeFunction = (
  filePath: string,
  chunkSize: number,
  chunkOverlap: number,
) => Promise<Document[]>;

const fileHandlers: Record<string, TokenizeFunction> = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    tokenizeWordDocument,
  "application/msword": tokenizeWordDocument,
  "application/vnd.ms-powerpoint": tokenizePowerpointDocument,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    tokenizePowerpointDocument,
  "application/pdf": tokenizePDF,
  "text/csv": tokenizeCsvFile,
};

const defaultHandler: TokenizeFunction = tokenizePlaintextFile;

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

export async function tokenizeFile(
  filePath: string,
  chunkOverlap: number = 200,
  chunkSize: number = 1000,
): Promise<DocumentChunk[]> {
  // Determine the mime type of the given filepath:
  let mimeType = lookup(filePath);
  if (mimeType === false) {
    throw new UnrecognizableFileType(
      `The filetype provided at path ${filePath} is unrecognizable`,
    );
  }

  const handler =
    fileHandlers[mimeType] ||
    (mimeType.startsWith("text/") ? defaultHandler : null);
  if (!handler) {
    throw new UnsupportedFileType(
      `The filetype provided at path ${filePath} is not supported (mime type: ${mimeType})`,
    );
  }
  const document = await handler(filePath, chunkSize, chunkOverlap);

  // * Convert Langchain dependency to a common structure:
  return document.map((doc: Document, index: number) => {
    return {
      id: doc.id ?? `idx-${index}`,
      metadata: doc.metadata,
      content: doc.pageContent,
    };
  });
}

export async function tokenizeFromBufferOrString(
  content: Buffer | string | Readable,
  extension: string,
  chunkOverlap: number = 200,
  chunkSize: number = 1000,
): Promise<DocumentChunk[]> {
  let tempFilePath: string | null = null;
  try {
    // Convert streams to buffers:
    const fileData: Buffer | string =
      content instanceof Readable ? await streamToBuffer(content) : content;
    // Create a temporary file
    tempFilePath = await writeTempFile(fileData, extension);
    // Tokenize the file using the existing tokenizeFile function
    return await tokenizeFile(tempFilePath, chunkOverlap, chunkSize);
  } catch (error) {
    console.error("Error during tokenization:", error);
    throw error;
  } finally {
    // Clean up: delete the temporary file
    if (tempFilePath) {
      await removeTempFile(tempFilePath);
    }
  }
}
