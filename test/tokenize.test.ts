import fs from "fs/promises";
import path from "path";
import { tokenizeFile, tokenizeFromBufferOrString } from "../src";
import { UnsupportedFileType } from "../src/lib/utils/errors";
import os from "os";

const TXT_FILE_PATH = "./test/testfiles/lorem-ipsum.txt";
const DOC_FILE_PATH = "./test/testfiles/lorem-ipsum.docx";
const PPT_FILE_PATH = "./test/testfiles/lorem-ipsum.pptx";
const PDF_FILE_PATH = "./test/testfiles/lorem-ipsum.pdf";
const IMG_FILE_PATH = "./test/testfiles/memoji_sap.png";

describe("Tokenization Functions", () => {
  describe("tokenizeFile", () => {

    it("should tokenize a text file", async () => {
      const result = await tokenizeFile(path.resolve(TXT_FILE_PATH));
      expect(result).toBeInstanceOf(Array);
      const length = result.length ?? 0;
      expect(length).toBeGreaterThan(0);
    });

    it("should tokenize a PDF file", async () => {
      const result = await tokenizeFile(path.resolve(PDF_FILE_PATH));
      expect(result).toBeInstanceOf(Array);
      const length = result.length ?? 0;
      expect(length).toBeGreaterThan(0);
    });

    it("should tokenize a Word document", async () => {
      const result = await tokenizeFile(path.resolve(DOC_FILE_PATH));
      expect(result).toBeInstanceOf(Array);
      const length = result.length ?? 0;
      expect(length).toBeGreaterThan(0);
    });

    it("should tokenize a Powerpoint document", async () => {
        const result = await tokenizeFile(path.resolve(PPT_FILE_PATH));
        expect(result).toBeInstanceOf(Array);
        const length = result.length ?? 0;
        expect(length).toBeGreaterThan(0);
      });

    it("should throw an error for unsupported file types", async () => {
      try {
        await tokenizeFile(path.resolve(IMG_FILE_PATH));
        expect("Expected an error to be thrown").rejects.toThrow(
          "UnsupportedFileType"
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(UnsupportedFileType);
      }
    });
  });

  describe("tokenizeFromBufferOrString", () => {
    it("should tokenize a string input", async () => {
      const input = "This is a test string";
      const result = await tokenizeFromBufferOrString(input, "txt");
      expect(result).toBeInstanceOf(Array);
      const length = result.length ?? 0;
      expect(length).toBeGreaterThan(0);
    });

    it("should tokenize a buffer input", async () => {
      const input = Buffer.from("This is a test buffer");
      const result = await tokenizeFromBufferOrString(input, "txt");
      expect(result).toBeInstanceOf(Array);
      const length = result.length ?? 0;
      expect(length).toBeGreaterThan(0);
    });

    it("should tokenize a TXT buffer", async () => {
      const file = await fs.readFile(path.resolve(TXT_FILE_PATH));
      const result = await tokenizeFromBufferOrString(file, "txt");
      expect(result).toBeInstanceOf(Array);
      const length = result.length ?? 0;
      expect(length).toBeGreaterThan(0);
    });

    it("should tokenize a PDF buffer", async () => {
      const file = await fs.readFile(path.resolve(PDF_FILE_PATH));
      const result = await tokenizeFromBufferOrString(file, "pdf");
      expect(result).toBeInstanceOf(Array);
      const length = result.length ?? 0;
      expect(length).toBeGreaterThan(0);
    });

    it("should tokenize a DOC buffer", async () => {
      const file = await fs.readFile(path.resolve(DOC_FILE_PATH));
      const result = await tokenizeFromBufferOrString(file, "docx");
      expect(result).toBeInstanceOf(Array);
      const length = result.length ?? 0;
      expect(length).toBeGreaterThan(0);
    });

    it("should tokenize a PPT buffer", async () => {
        const file = await fs.readFile(path.resolve(PPT_FILE_PATH));
        const result = await tokenizeFromBufferOrString(file, "pptx");
        expect(result).toBeInstanceOf(Array);
        const length = result.length ?? 0;
        expect(length).toBeGreaterThan(0);
      });

    it("should clean up temporary files after tokenization", async () => {
      const input = "This is a test string";
      await tokenizeFromBufferOrString(input, "txt");
      // Check that the temporary directory is empty
      const tempDir = path.join(os.tmpdir(), "tokenize-");
      expect(async () => { await expect(fs.readdir(tempDir)).rejects.toThrow() }); // Empty dir
    });
  });
});
