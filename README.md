# OPFS

OPFS stand for Origin Private FileSystem. It's an hidden filesystem, available in modern web browsers. There's no possibility to see what's stored in OPFS unless you add
an extension like [OPFS Explorer](https://chrome.google.com/webstore/detail/opfs-explorer/acndjpgkpaclldomagafnognkcgjignd) on your browser

It's for now a pretty good place to store sensitive data, as files are only accessible by script domain. Files stored in OPFS are not "real OS  files", because OPFS data are not easely identifable on the OS FileSystem. More than that, with OPFS you'll be able to edit and manipulate files with javascript directly, even if you app is offline.

NCI has released a very simple class based connector to the browser Origin Private File System API to allow you to manipulate OPFS files with no pain.

Enjoy.
