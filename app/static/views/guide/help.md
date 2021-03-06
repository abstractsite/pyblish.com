---
title: Help
next: /
previous: /guide/faq
---

# Troubleshooting

Remember that you can always get in contact with a human, via Gitter or email.

- [Gitter](https://gitter.im/pyblish/pyblish)
- [Email](mailto:hello@abstractfactory.io)

> ImportError: Error: Couldn't find pyblish_maya on your PYTHONPATH

This may be due to the default Python `site-packages` directory not being available to Maya. This is where all packages installed in Python goes, including Pyblish. To remedy this, add this path to your PYTHONPATH.

```bash
# On Windows, this path is typically located here:
c:\Python27\Lib\site-packages
```

You can add the environment variable by first restarting your terminal *(this is important)* then typing this:

```bash
# WARNING: This will modify your user environment variables
$ setx PYTHONPATH %PYTHONPATH%;c:\Python27\Lib\site-packages
```

For more help with modifying your environment, see [here][var]

[var]: https://github.com/pyblish/pyblish/wiki/Adding-an-environment-variable


> I'm still having trouble.

Add a comment below, or [email us][email] and we'll get back to you asap!

[email]: mailto:marcus@abstractfactory.io