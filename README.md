# Tokenizer Utility
This is a small utility I have built to support in other AI-related projects.
It doesn't do much and I did not want to create more than this: it does exactly what I need.

If it can help you or you feel it is worth an upgrade, feel free to fork this. Pull-requests are warmly welcome.

## Why
While working with Reality Augmented Generation, you usually have the need of processing a file in order to generate embeddings for it. The common technique is to split the file in chunks, then generate embeddings for each chunk.

It is a repetitive and tedious task and instead of copying/pasting the same function over and over again, I decided to build a small library.

## What
Tokenizer exposes two main functions:
- `tokenizeFile`
- `tokenizeFromStringOrBuffer`

They both do the same thing, but starting from a different point: as the name implies, you can provide a file path to `tokenizeFile` whereas you can provide a `string` or a `buffer` to `tokenizeFromStringOrBuffer`.

### Supported Files
It currently supports files that can include text: `pdf`, `doc` and `docx` and text based files like `txt`, `csv`, etc...

It applies an heuristic approach to best determine which kind of file or buffer it is provided with:

- `tokenizeFile` first uses the [`mime-types`](https://www.npmjs.com/package/mime-types) module to determine the file type. If this fails (mainly because the provided file has a mismatching extension or does not have an extension at all), it uses the [`file-type`](https://www.npmjs.com/package/file-type) module to look at the file content and determine its type.

- `tokenizeFromStringOrBuffer` assumes that if the provided content is a string then the resulting file is a text-based one. If the provided content is a buffer, it uses `file-type` as above to look at the buffer content and determine which kind of file is and it generates a temporary file using the returned extension.
Since `file-type` does not support text-files, it returns an `undefined` value if the buffer contains a string or a text-only buffer: the function therefore generates a `txt` temporary file.
After temporary file generation, it calls `tokenizeFile` providing the temp path to it.

### Langchain Parameters
In all cases, this library uses Langchain's function `RecursiveCharacterTextSplitter` to process the given text.
You can check its signature [here](https://v02.api.js.langchain.com/classes/_langchain_textsplitters.RecursiveCharacterTextSplitter.html).

This library currently only uses 2 of them:
- `chunkSize`: the size of each text chunk in bytes. Defaults to 1000
- `chunkOverlap`: amount of bytes that can overlap between two adjacent chunks. Defaults to 200

## Who
Me myself and I.

# Contributions
See [CONTRIBUTING.md](./CONTRIBUTING.md)

# License
See [LICENSE](./LICENSE)
