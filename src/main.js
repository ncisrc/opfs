var opfsRoot = null
var opfsDirectory = null
var opfsPath = "/"
var readyCallback = null

export const ready = false;

navigator.storage.getDirectory().then((result) => {
  opfsRoot = result;
  ready = true;
  if (readyCallback != null) readyCallback()
})

export async function onReady(callback) {
  readyCallback =  callback
}

function getOpfs() {
  return (opfsPath === "/") ? opfsRoot : opfsDirectory;
}

export async function ls(path = null) {
  const originPath = opfsPath;
  if (path) await cd(path, true)

  let rAry = []
  const opfs = getOpfs();
  const entries = await opfs.entries()
  for await (const entry of entries) {
    const file = (entry[1].kind == 'file') ? await entry[1].getFile() : null
    rAry.push({
      name : entry[0],
      type : entry[1].kind,
      size : file ? file.size : 0
    })
  }

  if (path) await cd(originPath, true)
  return rAry;
}

export async function cd(path, create=false) {

  if (path.substring(0,1) !== "/")
    throw Error('Path must be an absolute path');

  opfsPath = "/"

  const dirAry = path.split("/");
  for (const dirName of dirAry) {
    if (dirName.trim() == "") continue

    const opfs = getOpfs();
    opfsDirectory = await opfs.getDirectoryHandle(dirName, {create})
    opfsPath += ((opfsPath === '/') ? '' : '/') + dirName
  }

  return opfsPath
}

export async function write(blob, filename, force) {
  if (!force && await exists(filename))
    throw Error("File already exists !")

  const originPath = opfsPath;
  const file = filepathSpliter(filename);

  if (file.path) await cd(file.path, true)

  const opfs = getOpfs();
  const fileHndl = await opfs.getFileHandle(file.name, { create: true })
  const writable = await fileHndl.createWritable()
  await writable.write(blob)
  await writable.close()

  if (file.path) await cd(originPath);

  return filename
}

export async function deleteFile(filename) {
  if (!await exists(filename))
    throw Error("File not found")

  if (filename === "/") return;
  const file = filepathSpliter(filename);
  await cd(file.path)
  const opfs = getOpfs();
  await opfs.removeEntry(file.name);
  return true;
}

export async function deleteDirectory(dirPath) {
  // TODO
}

export async function exists(filepath) {
  const file = filepathSpliter(filepath);
  const entries = await ls(file.path);
  const item = entries.find(item => item.name === file.name)
  return item ? true : false
}

/**
 * Read the content of filename (in current directory)
 * @param {string} filename
 * @returns
 */
export async function read(filepath) {
  if (!await exists(filepath))
    throw Error('File not found')

  const file = filepathSpliter(filepath);
  const opfs = getOpfs();
  const fileHndl = await opfs.getFileHandle(file.name)

  return await fileHndl.getFile()
}

/**
 * Return the size of the file in bytes
 * @param {string} filename
 * @returns int
 */
export async function size(filename) {
  const file = filepathSpliter(filename);
  await cd(file.path);
  const opfs = getOpfs();
  const opfsFile = await opfs.getFileHandle(file.name)
  const realFile = await opfsFile.getFile();
  return realFile.size
}

/**
 * Get quota from the estimate function
 * @returns object
 */
export async function quotas() {
  return await navigator.storage.estimate()
}

/**
 * Get quota from the estimate function
 * @returns object
 */
export async function usagePercent() {
  const space = await navigator.storage.estimate()
  return (space.usage * 100 / space.quota)
}

export function cwd() {
  return opfsPath;
}

/**
 * Download the fileUrl and save it in OPFS
 * @param {string} fileUrl
 * @param {string} saveAs
 * @returns
 */
export async function writeFromUrl(fileUrl, saveAs = null, force = false) {
  const filename = fileUrl.split("/").pop()
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const name = (saveAs) ? saveAs : filename
  opfsPath = "/"
  return write(blob, name, force)
}

/**
 * Download file from OPFS with the native browser 'Download'
 * @param {string} filename
 * @param {string} downloadAs
 */
export async function download(filepath, downloadAs = null) {
  const filename = filepath.split("/").pop()
  const fileHndl = await read(filepath)

  if (fileHndl) {
    const url = URL.createObjectURL(fileHndl)

    const a = document.createElement("a")
    a.style = "display: none"
    document.body.appendChild(a)

    a.href = url
    a.download = downloadAs ? downloadAs : filename
    a.click()

    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}

// TOOLING ******************************************************************

/**
 * Split the name and path from filepath
 * @param {string} filepath
 * @returns object
 */
function filepathSpliter(filepath) {
//  const isAbsolutePath = (filepath.substring(0,1) === "/")
  const fileSpliter = filepath.split("/")

  const name = fileSpliter.pop()

  let path = ""
  path = fileSpliter.join('/')
  path = (path === "//") ? "/" : path
  path = (path === "") ? null : path

  return {
    name,
    path
  }
}

export function basePath(path) {
  let parentPath = path.substring(0, path.substring(0, path.length-1).lastIndexOf('/')+1)
  parentPath = (parentPath == "") ? "/" : parentPath
  return parentPath
}

export function baseName(filepath) {
  return filepath.split("/").pop()
}