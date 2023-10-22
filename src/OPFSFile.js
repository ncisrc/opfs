import { opfsDirHndl, opfsFileHndl } from "./opfs"
export default class OPFSFile {

  constructor(filepath) {
    this.type = "file"

    const pathAry = filepath.split("/")
    this.name = pathAry.pop()
    this.path = "/" + pathAry.join('/')
    this.path = (this.path === "//") ? "/" : this.path
    this.content = null
    return this
  }

  path() {
    return this.path
  }

  name() {
    return this.name
  }

  async file() {
    const opfsFile = await opfsFileHndl(this.path, this.name)
    return await opfsFile.getFile()
  }

  async size() {
    const realFile = await this.file()
    return (realFile) ? realFile.size : -1
  }

  async exists() {
    const realFile = await this.file()
    return (realFile) ? true : false
  }

  async save(blob, force = false) {
    if (!force && await this.exists())
      throw Error("File already exists ! Force save to replace content of the file")

    const fileHndl = await opfsFileHndl(this.path, this.name, true)
    const writable = await fileHndl.createWritable()
    await writable.write(blob)
    await writable.close()
    return true;
  }

  async delete() {
    const opfsFile = await opfsFileHndl(this.path, this.name)
    return await opfsFile.remove()
  }

  async rename() {
    console.log("FileRename : Not implemented yet")
  }
}