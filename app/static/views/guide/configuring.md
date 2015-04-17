---
title: Configuring
next: /guide/mocking
previous: /guide/installation
---

# Configuring Pyblish

Besides being completely driven by plug-in, Pyblish also provides options to be configured further. Primarily in the form of exposing the various plug-ins to your various circumstances. You can do that, let's find out how.

- Custom paths
- Debugging Paths

## Custom paths

The most important aspect of configuration is how you expose your plugins to your pipeline. Paths are added either dynamically, or statically.

- Dynamically
- Statically

#### Dynamic paths

Dynamic paths are added at run-time via Python and is known as *registering paths* and can be done like this:

```python
>>> import pyblish.api
>>> pyblish.api.register_plugin_path(r'c:\my_path')
```

You can manipulate the paths further with the following functions:

```python
>>> pyblish.api.deregister_plugin_path(r'c:\my_path')
>>> pyblish.api.deregister_all()
```

To inspect which paths are currently registered, you can use this:

```python
>>> pyblish.api.registered_paths()
['c:\my_path']
```

#### Static paths

Static paths are added to an environment variable - similar to `PYTHONPATH` - called `PYBLISHPLUGINPATH`. These will get picked up by Pyblish at run-time and augment any pre-existing paths already registered.

This is particularly helpful if you launch processes via a [wrapper][], which you can configure to append plugins relevant to your particular project.

```python
import os
import subprocess

custom_environment = os.environ.copy()
custom_environment['PYBLISHPLUGINPATH'] = "c:\spiderman_plugins"

subprocess.Popen('maya', env=custom_environment)
```

[wrapper]: https://github.com/pyblish/pyblish/wiki/Glossary#wrapperbootstrapper

# Debugging Configuration

To inspect *all* paths exposed to Pyblish, including those added via PYBLISHPLUGINPATH and configuration, you can use this:

```python
>>> pyblish.api.plugin_paths()
['c:\Python27\Lib\site-packages\pyblish\plugins', 'c:\my_environment_path']
```

This is can be great for debugging if you ever get lost in the midst of paths. 

Here's how you visualise environment paths.

```python
>>> import os
>>> os.environ['PYBLISHPLUGINPATH']
'c:\my_environment_path'
```
