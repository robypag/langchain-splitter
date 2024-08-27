import * as fs from "fs";
import os from "os";
import path from "path";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { pipeline } from 'stream/promises';

export async function writeTempFile(content: string | Buffer | Readable, extension: string): Promise<string> {
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "tokenize-"));
  const tempFilePath = path.join(tempDir, `temp-${uuidv4()}.${extension}`);

  // Write the content to the temporary file
  if (typeof content === "string") {
    await fs.promises.writeFile(tempFilePath, content, "utf8");
  } else if (content instanceof Buffer) {
    await fs.promises.writeFile(tempFilePath, content);
  } else if (content instanceof Readable) {
    const writeStream = fs.createWriteStream(tempFilePath);
    await pipeline(content, writeStream);
  }
  return tempFilePath;
}

export async function removeTempFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath);
    await fs.promises.rmdir(path.dirname(filePath));
  } catch (cleanupError) {
    console.error("Error cleaning up temporary file:", cleanupError);
  }
}
