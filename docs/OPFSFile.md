# OPFSFile

## Usage (in script)
```js
import { OPFSFile } from "nci-opfs"
```

## Methods
| Property / Method     | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| new OPFSFle(filepath) | `filepath` represent where the file will be or is stored in OPFS |
| type()                | is the type of OPFS object. 'file' as string                     |
| path()                | is the string representing the path of the file                  |
| name()                | is the string representing the filename                          |
| file()                | return a Javascript File Object of the OPFS File                 |
| size()                | return the size in Octet of the file                             |
| exists()              | return true if the file exists, false if not                     |
| save(blob, force)     | save the `blob` using the `filepath` given when constructed. You can overwrite existing file setting the `force` parameter to `true` |
| delete()              | delete the OPFS file                                             |
| rename()              | Not implemented yet                                              |