---
title: Mocking
next: /guide/publishing
previous: /guide/configuring
---

# Mocking With Pyblish

When working on plugins for Pyblish, it can sometimes be helpful to put aside heavy dependencies of host applications such as Autodesk Maya or SideFx Houdini and instead work a little closer to the metal of what makes Pyblish tick.

For these circumstances, here is some information about how you can mock the various components so as to bypass or augment the publishing process, or to isolate your plugin from external stimuli.

I'll be presenting some source code below, you can either copy paste it as we go along, or you can head on over to the source code for all examples bundled into one complete example.

- Mocking instances
- Mocking plugins
- A mocking conclusion
- Nail on the head
- [**Source code**][full]

### Mocking Instances

An instance is a collection of data that is on its way to become one or more files on disk. The context contains one or more instances, and as plugins only deal with contexts, we'll need it to make an instance:

```python
import pyblish.api

context = pyblish.api.Context()
instance = context.create_instance(name='MyInstance')
```

The next step is to add a family, so that compatible plugins can operate on it.

```python
instance.set_data('family', value='my_family')
```

And that's it. We can now publish this instance.

```python
for type in ('selectors', 'validators', 'extractors', 'conforms'):
    for plugin in pyblish.api.discover(type):
        plugin().process_all(context)
```

This will take it through the stages of being published. But of course, we have no plugins compatible with the family `my_family`. So we'll need to make some.

### Mocking Plugins

A plugin is a subclass of `Plugin` which has a subclass for each type of plugin. So let's start with that.

```python
class ValidateMyInstance(pyblish.api.Validator):
     family = ['my_family']
     host = ['maya']

     def process_instance(self, instance):
         assert instance.data('family') == 'my_family'
```

This plugin is now compatible with our instance. And as we're in the midst of mocking, let's not bother saving this out to a file. Instead, we'll use it directly.

```python
for type in ('selectors', 'validators', 'extractors', 'conforms'):
    for plugin in pyblish.api.discover(type):
        plugin().process_all(context)
 
    if type == 'validators':
        # Run our mocked up plugin once validators kick in
        ValidateMyInstance().process_all(context)
```

## A Mocking Conclusion

And so the story goes. Now we can easily make instances on our own behalf, instead of having Selectors create them for us. We can create our own plugins on-the-fly, without bothering with paths or discovery.

With this in mind, we should be able to make a fully-featured UI. A UI that displays what instances we've created, and what plugins are about to be processing them.

### Nail On The Head

Since publishing typically is associated with actually writing something to disk, as a final example, let's mock a plugin that does this.

```python
instance.set_data('document_content', 'Hello World!')
instance.set_data('document_name', 'MyDocument.txt')
```

As you'll see, this isn't your typical Maya instance with nodes being exported. This is a plain file writer, storing a very important message on disk.

Now we need our extractor.

```python
import os

class ExtractDocument(pyblish.api.Extractor):
    families = ['my_family']
    hosts = ['*']

    def process_instance(self, instance):
        content = instance.data('document_content')
        name = instance.data('document_name')

        # Since we aren't in Maya or anything, let's use the Current
        # Working Directory as parent to our document.
        parent_dir = instance.context.data('cwd')

        # The current working directory is being added to the context by
        # one of the included selector plugins. Now let's write the
        # document to disk.
        path = os.path.join(parent_dir, name)
        with open(path, 'w') as f:
            print "Writing message to %s" % path
            f.write(content)
```

And that's it. This extractor will keep overwriting the same file over and over, each time it is run, and it will save the file right next to wherever you first launched the script from.

Full example [here][full].

[full]: https://gist.github.com/mottosso/124d376c46853a574c0a
