
import OPFSDirectory from './OPFSDirectory';
import OPFSFile from './OPFSFile'

export {
  OPFSDirectory,
  OPFSFile
}

/**
 * Delete all files and directories in OPFS
 * @returns
 */
export async function _format() {
  const root = new OPFSDirectory('/');
  const items = await root.ls()
  for (const entry of items) {
    await entry.delete();
  }
  return true;
}

/**
 * Return an OPFSFile instance for the given absolute 'filepath'
 * @param {string} filepath
 * @returns
 */
export function openFile(filepath) {
  return new OPFSFile(filepath);
}

/**
 * Save a blog into an OPFS File
 * @param {string} filepath
 * @param {blob} blob
 * @param {boolean} force
 * @returns
 */
export async function saveFile(filepath, blob, force = false) {
  const opfsFile = new OPFSFile(filepath);
  await opfsFile.save(blob, force);
  return opfsFile;
}

/**
 * Get the text of an OPFS File
 * @param {string} filepath
 * @returns
 */
export async function getFileContents(filepath) {
  const opfsFile = new OPFSFile(filepath);
  const blob = await opfsFile.file();
  return await blob.text();
}

/**
 * Return an OPFSFile instance for the given URL.
 * If no 'saveAsFilename' is given, file will be saved at the root, with
 * same filename as in the URL.
 * @param {string} url
 * @param {string} saveAsFilename
 * @returns
 */
export async function saveFileFromUrl(url, saveAsFilename = null, force = true) {
  const filename = url.split("/").pop()
  const response = await fetch(url);
  const blob = await response.blob();
  const name = (saveAsFilename) ? saveAsFilename : filename
  return await saveFile(name, blob, force);
}

/**
 * Return an OPFSDirectory instance of the given absolute 'path'
 * @param {string} path
 * @returns
 */
/*
export function directory(path = "/") {
  return new OPFSDirectory(path)
}
*/

/**
 * Send the OPFS file content as a browser download
 * Name of the downloaded file can be set using 'downloadAs'
 * @param {string} filepath
 */
export async function downloadFile(filepath, downloadAs = null) {
  const fileHndl = new OPFSFile(filepath);
  if (fileHndl) {
    const realFile = await fileHndl.file()
    const url = URL.createObjectURL(realFile)

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

/**
 * Get all data of browser disk quota (as a promise)
 * @returns object
 */
export function diskQuotas() {
  return navigator.storage.estimate()
}

/**
 * Get the actuel quota's disk usage in percent
 * @returns object
 */
export async function diskUsage() {
  const space = await navigator.storage.estimate()
  return (space.usage * 100 / space.quota)
}
