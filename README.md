# NCI OPFS

## What is OPFS ?
OPFS stand for Origin Private FileSystem. It's an hidden filesystem, available in modern web browsers. There's no possibility to see what's stored in OPFS unless you add an extension like [OPFS Explorer](https://chrome.google.com/webstore/detail/opfs-explorer/acndjpgkpaclldomagafnognkcgjignd).

It's for now a pretty good place to store sensitive data, as files are only accessible by script domain. Files stored in OPFS are not "real OS  files", because OPFS data are not easely identifable on the OS FileSystem. More than that, with OPFS you'll be able to edit and manipulate files with javascript directly, even if you app is offline.

NCI has released this library to allow you to manipulate OPFS files with no pain.

Enjoy.

## Usage

In browser :
```html
<script src="nci-opfs.min.js"></script>
<script>
// Save a file from internet into OPFS
await nopfs.saveFileFromUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')

// Download the saved file (like a normal file download of the browser)
await nopfs.downloadFile("dummy.pdf")

// Save the text "hello world !" into a text file
const blob = new Blob(["Hello World"], { type: "text/plain" })
await nopfs.saveFile("hello.txt", blob, true)

// Show the content of the text in an alert
const text = await nopfs.getFileContents("hello.txt")
alert(text)

// Delete file
const file = await nopfs.openFile("hello.txt");
file.delete();
</script>
```

Complete documentation :
- [NOPFS Functions](./docs/NOPFS.md)
- [OPFSDirectory](./docs/OPFSDirectory.md)
- [OPFSFile](./docs/OPFSFile.md)

## Test Suite
As OPFS is only available in the browser, unit testing is very hard.

OPFSDirectory and OPFSFile allow to inject a mock interface to allow unit testing (cf. todos).

NOPFS have a testing suite in [tests.html](./tests.html) File.

## NPM Commands
- `npm run build` : Build the library
- `npm run watch` : Build the library as soom as a file is saved
- `npm run serve` : Start an HTTP server on port 8080 to run tests.html
- `npm run test`  : Run vitest unit tests

## Todos before v1.0

- [x] Complete rewrite of the library
- [ ] Implement `rename` in `OPFSFile`
- [ ] Implement `rename`, `delete` in `OPFSDirectory`
- [ ] Unit testing `OPFSFile`
- [ ] Unit testing `OPFSDirectory`