---
title: Installation
next: /guide/configuring
previous: /guide/mechanism
---


# Installation

The best way to learn anything is to try things out.

- [Download Pyblish for Windows][win]
- [Download Pyblish for OSX][osx]
- [Download Pyblish for Linux][linux]

[win]: https://github.com/pyblish/pyblish-win/releases/latest
[osx]: https://github.com/pyblish/pyblish-osx/wiki
[linux]: https://github.com/pyblish/pyblish-linux/wiki

To test things out, let's try and import our newly installed package. Launch a Python interpreter and type this in.

```python
>>> import pyblish
>>> pyblish.version
'{{ site.version }}'
```

> If this isn't the results you've got, head on over to [Troubleshooting](#troubleshooting) and we'll try and get things sorted.
