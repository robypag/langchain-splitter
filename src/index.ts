import { tokenizePDF } from "./lib/pdf.js";
import { tokenizePlaintextFile } from "./lib/plaintext.js";
import { removeTempFile, writeTempFile } from "./lib/utils/index.js";
import {
  UnrecognizableFileType,
  UnsupportedFileType,
} from "./lib/utils/errors.js";
import { tokenizeWordDocument } from "./lib/word.js";
import { fileTypeFromFile, FileTypeResult, fileTypeFromBuffer } from "file-type";
import { lookup } from "mime-types";

export async function tokenizeFile(
  filePath: string,
  chunkOverlap: number = 200,
  chunkSize: number = 1000
): Promise<string[]> {
  // Determine the mime type of the given filepath:
  let mimeType = lookup(filePath);
  if (mimeType === false) {
    let fileType: FileTypeResult | undefined = await fileTypeFromFile(filePath);
    if (!fileType) {
      throw new UnrecognizableFileType(
        `The filetype provided at path ${filePath} is unrecognizable`
      );
    } else {
      mimeType = fileType.mime;
    }
  }
  // Process based on mime type
  if (
    mimeType.startsWith(
      "application/vnd.openxmlformats-officedocument.wordprocessingml"
    ) ||
    mimeType === "application/msword"
  ) {
    return await tokenizeWordDocument(filePath, chunkSize, chunkOverlap);
  } else if (mimeType === "application/pdf") {
    return await tokenizePDF(filePath, chunkSize, chunkOverlap);
  } else if (mimeType.startsWith("text/")) {
    return await tokenizePlaintextFile(filePath, chunkSize, chunkOverlap);
  } else if (mimeType === "application/octet-stream") {
    throw new UnsupportedFileType(
      `The file at ${filePath} is of type application/octet-stream, which may not be a text file and cannot be safely processed.`
    );
  } else {
    throw new UnsupportedFileType(
      `The filetype provided at path ${filePath} is not supported (mime type: ${mimeType})`
    );
  }
}

export async function tokenizeFromBufferOrString(
  content: Buffer | string,
  chunkOverlap: number = 200,
  chunkSize: number = 1000
): Promise<string[]> {
  let tempFilePath: string | null = null;
  let extension: string = 'txt';
  try {
    // Check if the file is a pure text file or not by using a reversed approach.
    // file-type will complain if the file is not a media type:
    if (content instanceof Buffer) {
        const fileType: FileTypeResult | undefined = await fileTypeFromBuffer(content);
        if (fileType) {
            extension = fileType.ext;
        }
    }
    // Create a temporary file
    tempFilePath = await writeTempFile(content, extension);
    // Tokenize the file using the existing tokenizeFile function
    const tokens = await tokenizeFile(tempFilePath, chunkOverlap, chunkSize);
    return tokens;
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
