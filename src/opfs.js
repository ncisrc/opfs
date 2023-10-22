export async function opfsDirHndl(path, create = false) {
  const opfsRoot = await navigator.storage.getDirectory()
  let opfsHndl = opfsRoot

  const dirAry = path.split("/")
  for (const dirName of dirAry) {
    if (dirName.trim() == "") continue
    opfsHndl = await opfsHndl.getDirectoryHandle(dirName, {create})
  }
  return opfsHndl;
}

export async function opfsFileHndl(path, name, create = false) {
  const opfsHndl = await opfsDirHndl(path, create)
  return await opfsHndl.getFileHandle(name, { create })
}
