# NOPFS Library

## Usage (in browser)
```html
<script src="nci-opfs.min.js"></script>
<script>
  nopfs.OPFS_METHOD (see below)
</script>
```


## Methods
| Function | Description |
| --- | --- |
| nopfs._format() | Remove all the files in the OPFS. Use with caution ! |
| nopfs.openFile(filepath) | Create an OPFSFile instance representing a file stored at `filepath` in the OPFS |
| nopfs.saveFile(filepath, blob, force) | Save `blob` data into an OFPS File stored at `filepath`. `force` parameter at true overwrite the file if it exists |
| nopfs.getFileContent(filepath) | Get the data contained in `filepath` file as text |
| nopfs.saveFileFromUrl(url, saveAs, force) | download the file `url` into an OFPS file. You can set a new name to this file using the `saveAs` parameter. You can overwrite an existing file if you set the `force` parameter at true. |
| nopfs.downloadFile(filepath, downloadAs) | Open a download windows (like a normal download) to save the OPFS file `filepath`. You can change the name of the download with the `downloadAs` parameter. |
| nopfs.diskQuotas | Get the disk quotas |
| nopfs.diskUpsage | Get the disk usage in percent |