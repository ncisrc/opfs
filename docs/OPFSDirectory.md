# OPFSDirectory

## Usage (in script)
```js
import { OPFSDirectory } from "nci-opfs"
```

## Methods
| Property / Method       | Description |
| ----------------------- | --------------------------------------------------------------------------------------- |
| new OPFSDirectory(path) | `path` represent a OPFS path                                                            |
| type()                  | Type of OPFS object. 'directory' as string                                              |
| path()                  | String representing the path of this directory                                          |
| ls()                    | Get all entries of the directory. The entries are OPFSFile and/or OPFSDirectory objects |
| exists()                | `true` if the path exists, `false` if not.                                              |
| rename()                | Not implemented yet.                                                                    |
| delete()                | Not implemented yet.                                                                    |