export async function startOPFS() {
  const fs = new nciOPFS();
  await fs.open();
  return fs;
}

export class nciOPFS {
  constructor() {
    this.root = null
    this.directoryHndl = null
    this.path = "/"
  }

  /**
   * Connect the browser OPFS
   * @returns boolean
   */
  async open() {
    this.root = await navigator.storage.getDirectory()
    this.directoryHndl = this.root;
    return true;
  }

  /**
   * Change active directory inside OPFS
   * @param {string} path
   * @returns boolean
   */
  async cd(path) {
    // console.log("CD:Path", path)
    const absolutePath = path.substring(0,1) === "/"
    if (absolutePath) this.directoryHndl = this.root;

    const arrayPath = path.split("/");
    this.path = "/"
    for (const pathItem of arrayPath) {
      // console.log("CD:PathItem", pathItem)

      if (pathItem == "") continue

      // Back to previous
      if (pathItem === "..") {
        const previousPath = this.parentOf(this.path);
        await this.cd(previousPath);
        this.path = previousPath
        continue
      }

      await this.directoryHndl.getDirectoryHandle(pathItem, {create: true})
      this.path += `${pathItem}/`
    }
    // console.log('CD:', this.path)
    return true
  }

  /**
   * Return the parent directory of path
   * @param {string} path
   * @returns string
   */
  parentOf(path) {
    let parentPath = path.substring(0, path.substring(0, path.length-1).lastIndexOf('/')+1)
    parentPath = (parentPath == "") ? "/" : parentPath
    return parentPath
  }

  /**
   * Return the current working directory
   * @returns string
   */
  cwd() {
    return this.path;
  }

  /**
   * Return an array of objects containing the 'name', 'type', and 'size' of elements in the path
   * Note : 'type' is either a "file" or a "directory"
   * @param {string} path
   * @returns array
   */
  async ls(path) {
    const originPath = this.path
    this.cd(path)

    let rAry = []
    const entries = await this.directoryHndl.entries()
    for await (const entry of entries) {
      const file = (entry[1].kind == 'file') ? await entry[1].getFile() : null
      rAry.push({
        name : entry[0],
        type : entry[1].kind,
        size : file ? file.size : 0
      })
    }
    // console.log('LS', this.path, rAry)

    this.cd(originPath)
    return rAry;
  }

  /**
   * Save a blog into a file
   * @param {string} filepath
   * @param {blob} blob
   * @returns
   */
  async save(filepath, blob) {
    return this.filepathAction(filepath, async (file) => {
      const fileHndl = await this.directoryHndl.getFileHandle(file.name, { create: true })
      const writable = await fileHndl.createWritable();
      await writable.write(blob)
      writable.close();
      // console.log("FILESAVE", this.path, file.name)
      return true;
    })
  }

  /**
   * return a File from the OPFS
   * @param {string} filepath
   * @returns
   */
  async load(filepath) {
    return this.filepathAction(filepath, async (file) => {
      // console.log('LOAD', file);
      const fileHndl = await this.directoryHndl.getFileHandle(file.name)
      return await fileHndl.getFile()
    })
  }

  /**
   * Return the size of the file in bytes
   * @param {string} filename
   * @returns int
   */
  async sizeOf(filename) {
    return this.filepathAction(filepath, async (file) => {
      const fileHndl = await this.directoryHndl.getFileHandle(filename)
      return fileHndl.size
    })
  }

  /**
   * Delete a file or a directory (recursively)
   * @param {string} pathOrFile
   */
  async rm(pathOrFile) {
    const originPath = this.path
    const parentPath = this.parentOf(pathOrFile)
    this.cd(parentPath)
    result = await this.directoryHndl.removeEntry(pathOrFile, {recursive: true})
    this.cd(originPath)
    return true
  }

  /**
   * Get quota from the estimate function
   * @returns object
   */
  async quotas() {
    return await navigator.storage.estimate()
  }

  /**
   * Download the fileUrl and save it in OPFS
   * @param {string} fileUrl
   * @param {string} saveAs
   * @returns
   */
  async saveFileFromUrl(fileUrl, saveAs = null) {
    const filename = fileUrl.split("/").pop()
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const name = (saveAs) ? saveAs : filename
    return this.save(name, blob)
  }

  /**
   * Download file from OPFS to the Native 'Download' directory on FS
   * @param {string} filename
   * @param {string} downloadAs
   */
  async downloadFile(filepath, downloadAs = null) {
    // console.log('DOWNLOADFILE', filepath)
    const filename = filepath.split("/").pop()
    const fileHndl = await this.load(filepath)
    // console.log('DOWNLOADFILE', filename, fileHndl)
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
   * Change the working directory to do the action, then switch back to the
   * previous directory
   * @param {string} filepath
   * @param {function} fn
   * @returns *
   */
  async filepathAction(filepath, fn) {
    const originPath = this.path;
    const file = this.filepathSpliter(filepath);
    // console.log('FILEPATHACTION', file)

    if (file.path) this.cd(file.path)
    const result = await fn(file)

    if (file.path) this.cd(originPath)
    return result;
  }

  /**
   * Split the name and path from filepath
   * @param {string} filepath
   * @returns object
   */
  filepathSpliter(filepath) {
    const isAbsolutePath = (filepath.substring(0,1) === "/")
    const fileSpliter = filepath.split("/")

    const name = fileSpliter.pop()

    let path = ""
    path = fileSpliter.join('/') + "/"
    path = (path === "//") ? "/" : path
    path = (path === "") ? null : path

    // console.log("FilePathSpliter", filepath, name, path)

    return {
      name,
      path
    }
  }
}
