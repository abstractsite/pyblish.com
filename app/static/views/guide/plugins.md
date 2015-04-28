---
title: Plugins
next: /guide/faq
previous: /guide/publishing
---

# Creating Your First Plugin

You're probably burning with the desire to re-define selection, validation, extraction and conform all in one go, but let's stick with those baby steps and implement just one plugin!

**Table of contents**

- Our plugin, the historian
- A little strategy
- A look at the interface
- Implementation
- We are family
- Adding host support
- Saving your work
- Running your plugin
- Registering your plugin
- Trying that again
- An error we've been waiting for
- Conclusion
- Persistently registering plugins
 - Via the environment variable
 - Via configuration

### Our Plugin, the Historian

We'll be continuing our journey from where the previous tutorial left off and validate our cube just a little bit more. This time, we'll make sure that it lives up to those quality standards and that it doesn't have any history left behind from modeling.

### A Little Strategy

Let's take a moment to think about how we want this to go down.

In a nutshell, we want a plugin to look at our cube and determine whether or not it has history attached. We can probably utilise the `maya.cmds` module, but which command specifically?

[`maya.cmds.listHistory()`][listhistory] looks good, let's try that.

```python
>>> history = cmds.listHistory('gollum_GEO')
>>> print history
[u'gollum_GEOShape', u'polyCube1']
```

Hmm, the command does indeed give us the history of our node, but it also returns a shape node. Looks like we'll also need to check for those before making our evaluation.

```python
>>> for node in history:
...    if cmds.nodeType(node) is not "mesh":
...        print "This node has history!"
...        break
```

That should do it. Now we have a way of looking at `gollum_GEO` and determine whether or not it has any history attached. We would like our validator to do the same and prevent users from publishing until the problem has been fixed.

[listhistory]: http://help.autodesk.com/cloudhelp/2015/ENU/Maya-Tech-Docs/CommandsPython/listHistory.html

### A Look At The Interface

Plugins are sub-classed from `Plugin` - a base-class located at `pyblish.api`. `Plugin` is further divided into four sub-classes; Selector, Validator, Extractor and Conform respectively.

To get started, let's create a new module and our own plugin subclass.

```python
# validate_history.py
import pyblish.api

class ValidateHistory(pyblish.api.Validator):
    pass
```

Each plugin carries two methods of interest to us - `process_context` and `process_instance` - processing the context and instance respectively.

As we are interested in processing our instance, which contains `gollum_GEO`, we'll choose an appropriate method to override.

```python
# validate_history.py
import pyblish.api

class ValidateHistory(pyblish.api.Validator):
    def process_instance(self, instance):
        pass
```

Now that we have access to our instance, let's take a moment to talk about what the instance is in terms of Python.

> Technically, Context and Instance are both sub-classes of the Python `list`. As lists, they can be treated as iterables; the context containing one or more instances and an instance containing one or more nodes in your scene.

> ```python
for instance in context:
    for node in instance:
        print "{0} - {1} - {2}".format(context, instance, node)
```

### Implementation

Considering this, we may retrieve `gollum_GEO` by iterating over the `instance` argument of `process_instance()`, and this is where we'll finally apply our validation. Don't forget to import `maya.cmds`.

```python
# Content discarded for brevity
...
    def process_instance(self, instance):
        for node in instance:
            for history in cmds.listHistory(node):
                if cmds.nodeType(history) != "mesh":
                    raise pyblish.api.ValidationError(
                        "%s has incoming history!" % node)
```

At the very end, you can see that we're raising an exception. This is a validator's way of saying that an instance has not passed validation. If a validator doesn't raise an exception, all is considered well and the instance is considered valid. 

The message within the exception is presented to the user, so it's important that it contains what went wrong and what the user can do to remedy the issue.

### We Are Family

Now there is just one thing remaining before this plugin is ready to go. We'll need to associate it with a family.

Remember from our last tutorial that we associated the family "demo.model" to our instance? Well, if we want our custom plugin to operate on this instance we'll need to make it compatible with this family.

```python
...
class ValidateHistory(pyblish.api.Validator):
    families = ['demo.model']
...
```

> A plugin can support multiple families. This is useful in situations where you may have a more general plugin apply to many types of families. For example, you may want naming convention to apply to both models and rigs.

### Adding Host Support

It is possible for you to have plugins applicable with a variety of hosts, not only for Maya. Some may only be compatible with Nuke, others with Houdini.

To indicate which host a particular plugin is designed for, add a `hosts` attribute to your plugin.

```python
...
class ValidateHistory(pyblish.api.Validator):
    families = ['demo.model']
    hosts = ['maya']
...
```

The full implementation now looks like this:

```python
import pyblish.api
from maya import cmds


class ValidateHistory(pyblish.api.Validator):
    families = ['demo.model']
    hosts = ['maya']

    def process_instance(self, instance):
        for node in instance:
            for history in cmds.listHistory(node):
                if cmds.nodeType(history) != "mesh":
                    raise pyblish.api.ValidationError(
                            "%s has incoming history!" % node)

```

### Running Your Plugin

Choose a directory to your liking and save your plugin as `validate_history.py`. 

The name is important. Any module starting with `validate_` is considered a validator-plugin. Just as those starting with `select_`, `extract_` and `conform_` are considered a selector-, extractor- and conform-plugin respectively.

For the sake of this tutorial, I'll assume you've saved your plugin here.

```
c:\my_plugins\validate_history.py
```

### Saving Your Work

Open up your scene from the last tutorial and run the following.

```python
import pyblish.util
context = pyblish.util.select(context)
```

> In this case, we've chosen to publish via Python commands, as opposed to a graphical user interface. This can be useful during debugging as it gives to access to the `Context` and each `Instance` along with all of their data.

At this point, `gollum_GEO` has been selected and now resides within an instance within the context. Let's run it through validation and see what happens.

```python
pyblish.util.validate(context)
```

Because `gollum_GEO` has history, the `polyCube1` generator, your plugin should have triggered an exception, but didn't. 

Why is that?

### Registering Your Plugin

For Pyblish to pick up your plugin, we'll first need to tell it about where you put it. You can register a directory in which you keep custom plugins. 

> You could store it along with where the other plugins are at, for example in the Pyblish for Maya integration package. But by doing this you risk loosing your plugins when updating or un-installing Pyblish.

In our case, we wish to register:

```
c:\my_plugins
```

We can do that by adding to following command:

```python
pyblish.api.register_plugin_path(r'c:\my_plugins')
```

### Trying That Again

Our full script now looks like this.

```python
import pyblish.api
import pyblish.util

pyblish.api.register_plugin_path(r'c:\my_plugins')

context = pyblish.api.Context()
pyblish.util.select(context)
pyblish.util.validate(context)
```

By registering our path, we've made Pyblish aware of our custom plugin.

### An Error We've Been Waiting For

If everything went right, we've got our error.

```python
# Error: pyblish.api.Plugin : An exception occured during processing of instance [u'Gollum'] # 
# Error: TypeError: file C:\Python27\Lib\site-packages\pyblish\main.py line 71: |gollum_GEO|gollum_GEOShape has incoming history! # 
```

You'll also see that if you try and publish, the validator will prevent you.

1. In your `File` menu
2. Click `Publish`

Or type the following:

```python
import pyblish.util
pyblish.util.publish()
```

The user has now been alerted of the fact that his cube isn't living up to the requirements set forth by us. 

We can remedy this by deleting all history.

1. With `gollum_GEO` selected
1. In your `Edit` menu
1. Click `Delete by Type`
1. Click `History`

Or type the following:

```python
cmds.delete('gollum_GEO', constructionHistory=True)
```

### Conclusion

Now that `gollum_GEO` is up to par with our standards, we can publish it once more!

1. In your `File` menu
2. Click `Publish`

Or type the following:

```python
import pyblish.util
pyblish.util.publish()
```

Thanks to your plugin, you can now rest assured that all content of this family in your library are completely free of any history. You can imagine how useful this becomes once your library starts growing. By making a few validators such as the one we just made, we can ensure that no content misbehaves and that all content remains familiar to those who use it. 