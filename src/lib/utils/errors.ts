export class PdfLoadingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfLoadingError";
  }
}

export class TextLoadingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TextLoadingError";
  }
}

export class WordLoadingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WordLoadingError";
  }
}

export class UnrecognizableFileType extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnrecognizableFileType";
  }
}

export class UnsupportedFileType extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedFileType";
  }
}
