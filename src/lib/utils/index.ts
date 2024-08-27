import * as fs from "fs/promises";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function loadFile(
  filePath: string,
  encoding?: BufferEncoding | undefined
): Promise<string | Buffer> {
  return await fs.readFile(filePath, encoding);
}

export async function writeTempFile(content: string | Buffer, extension: string): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "tokenize-"));
  const tempFilePath = path.join(tempDir, `temp-${uuidv4()}.${extension}`);

  // Write the content to the temporary file
  if (typeof content === "string") {
    await fs.writeFile(tempFilePath, content, "utf8");
  } else {
    await fs.writeFile(tempFilePath, content);
  }
  return tempFilePath;
}

export async function removeTempFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
    await fs.rmdir(path.dirname(filePath));
  } catch (cleanupError) {
    console.error("Error cleaning up temporary file:", cleanupError);
  }
}
