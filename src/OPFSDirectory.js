import { opfsDirHndl } from "./opfs"
import OPFSFile from "./OPFSFile"

export default class OPFSDirectory {

  constructor(path, opfs = opfsDirHndl) {
    this.opfs = opfs
    this.type = "directory"
    this.path = path
    return this
  }

  async ls() {
    let rAry = []
    const opfsDir = await this.opfs(this.path)
    const entries = await opfsDir.entries()
    for await (const entry of entries) {
      rAry.push((entry[1].kind == 'file')
        ? new OPFSFile(`${this.path}/${entry[0]}`)
        : new OPFSDirectory(`${this.path}/${entry[0]}`)
      )
    }
    return rAry
  }

  async exists() {
    let opfsDir = null
    try { opfsDir = await this.opfs(this.path) } catch(e) {}
    return (opfsDir !== null)
  }

  async rename() {
    console.log("Directory rename: Not implemented yet")
  }

  async delete(recursive = true) {
    console.log("Directory delete : Not implemented yet")
  }
}