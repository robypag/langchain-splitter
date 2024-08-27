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

export class CsvLoadingError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "CsvLoadingError";
    }
  }

export class WordLoadingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WordLoadingError";
  }
}

export class PowerpointLoadingError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "PowerpointLoadingError";
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
