---
title: Publishing
next: /guide/plug-ins
previous: /guide/mocking
---

# Publishing

The following sections are an example of how to get up and running with Autodesk Maya.

# Making Your First Publish

By the end of this page, sir, *you* will have made your first publish. Just follow these steps one by one and I'll take you through how to make it happen.

**Table of contents**

- Create Gollum
- Select him
- Make him publishable
- Breakdown
 - Where did the publish go?
 - Why did it go there?
- Conclusion

### Create Gollum

All great things have small beginnings. Let's start with a cube.

1. In your `Create` menu
2. Click `Polygon Primitives`
3. Click `Cube`
4. Rename your cube to "gollum"

Or type the following in your script editor.

```python
from maya import cmds
cmds.polyCube(name='gollum')
```

### Publish

Allright, let's try publishing.

1. In your `File` menu
2. Click `Publish`

No instances found! What is that all about? As it turns out, there is more to be done.

### Selection

`Selection` is an important keyword in Pyblish. `Selection` means to identify a particular set of data within a larger set of data. In our case, we need to separate between what is Gollum, and what is everything else.

As mentioned in the section about the [Pyblish Mechanism](guide/mechanism), `Selection` is completely arbitrary and depends entirely on your implementation. For this tutorial, we will make use of a demo Selector that ships with the Pyblish for Maya integration.

To select Gollum, add it to a selection set.

1. In your `Create` menu
2. Click `Sets`
3. Followed by `Set`
4. Rename your set to "Gollum"

Or, type the following:

```python
cmds.sets(name='Gollum')
```

If you didn't have `gollum` selected when you created the set, make sure to add it to the set, either by dragging-and-dropping or by typing:

```python
cmds.sets('gollum', addElement='Gollum')
```

### Publish

Allright, let's try that again.

1. In your `File` menu
2. Click `Publish`

Hmm, we're still missing something.

### Make it publishable

For Pyblish to know that *this* is what you would like to Publish, and nothing else, we need to tag the selection set. To tag it, add the following attributes and values.

```yaml
publishable (bool): True
family (string): "demo.model"
```

You can add it by going to your [Channel Box][chan].

1. In your `Edit` menu
2. Click `Add Attribute`
3. Type `publishable` as `Long name`
4. Click `Boolean` as `Data Type`
5. Hit `Add`
6. Type `family` as `Long name`
7. Click `String` as `Data Type`
8. Hit `OK`

[chan]: http://download.autodesk.com/global/docs/maya2014/en_us/files/GUID-424694BA-019A-4D05-86EF-F9CD0A69D92C.htm
[attributeeditor]: http://download.autodesk.com/global/docs/maya2014/en_us/files/GUID-67A58D31-4722-4769-B3E6-1A35B5B53BED.htm

Or type the following:

```python
cmds.addAttr('Gollum', at='bool', longName='publishable')
cmds.addAttr('Gollum', dt='string', longName='family')
```

Next, fill in the values.

1. In your [Attribute Editor][attributeeditor]
2. Under `Extra Attributes`
3. Toggle `publishable` to True
4. Type `demo.model` in the `family` text box

Or type the following:

```python
cmds.setAttr('Gollum.publishable', True)
cmds.setAttr('Gollum.family', 'demo.model', type='string')
```

Now Pyblish will be able to distinguish between this set and any other set you might have.

### Publish

Third time's the charm, right?

1. In your `File` menu
2. Click `Publish`

In the Pyblish GUI, you should now be seeing your Gollum instance, along with a few plug-ins. Once you publish, one of the validators indicates that there is something invalid about Gollum.

```python
# ValueError: The following nodes were misnamed
#   gollum
```

By the looks of it, Gollum wasn't named according to the demo naming conventions bundled with the Pyblish for Maya integration. Let's try and remedy this. The naming convention in this case is for everything you publish to always have a three-letter extension.

1. Rename `gollum` to `gollum_GEO`
2. Re-publish

Publishing should now proceed successfully, if it didn't, head on to the [Toubleshooting](guide/help).

## Dissection

Ok, let's back up a second and reflect on what happened. There are a couple of questions left unanswered from running your first publish above.

1. Where did the publish go?
1. Why did it go there?
1. Where did the naming convention come from?
1. Why did we have to add the two attributes, `publishable` and `family`?
1. Why did we have to put `gollum` into a selection set?

From the top:

1. To your workspace.
1. Because the plug-in `extract_as_ma` put it there.
1. From the plug-in `validate_naming_convention`.
1. Because the plug-in `select_object_set` was looking for it.
1. Because the plug-in `select_object_set` was looking for this too.

Too direct? Yes, let's have a closer look at how all of this fits together.

### Where Did the Publish Go?

> To your workspace.

If you look within your project directory, you'll notice that you've now got a new folder called `published`.

```
C:\Users\marcus\Documents\maya\projects\default\published
```

This is where Pyblish chose to store `Gollum` when you hit the Publish button. But how did it know to do that? And why did it put it in a subdirectory that looks like the current date and time, followed by a few other directories?

- published
 - 20140907-174550
  - demo.model
   - Gollum

And how did it know to produce 4 files? Why not 5, or 3? 

- Gollum
 - Gollum.ma
 - Gollum.mb
 - Gollum.obj
 - Gollum.mtl

Well, the answer lies in the plug-ins.

### 5 Minutes Later

> Ok, so a selection plug-in *selects* the cube?

Yes. It knows to do this because of how it is implemented.

It looks for nodes of type `objectSet` in your scene; specifically, nodes with the two attributes we added - `publishable` and `family`.

If you were to remove any of these two, the selector would go blind.

> Can I add anything to the `objectSet`?

Yes you can! That is the whole idea - you add what you intend on sharing with others. This way, you can separate the part of your scene that is sharable from the part that is not.

> What about the two attributes. What are they?

That's a good question. The `publishable` is merely an attribute to help the selector distinguish the nodes you are interested in publishing from those you are not. It's a way for the node to say "Me! Me! Me!" when you've got three identical nodes in your scene.

Remember when Neo took the red pill and they were able to locate him amongst a field of pods identical to his own?

`family` is where things start getting interesting. The family is a critical element of Pyblish. It's a way of saying "*this* instance belongs to *this* group of plug-ins". If you look at the selection set in your scene from your Attribute Editor, under "Extra Attributes", you'll see that the family attribute has the value "demo.model".

```python
print cmds.getAttr('Gollum.family')
```

> "demo.model"?

Yes, this is a way for the instance to say "I'd like all plug-ins compatible with `demo.model` to process me". Each plug-in is associated with at least one (1) family. In effect, the instance is processed by a number of plug-ins compatible with this family.

```python
# A plug-in may support multiple families, but
# an instance may only support one.
 _______________        _______________
|               |      |               |
| Instance      |      | Plugin        |
|               |      |               |
|    demo.model o----->o demo.model    |
|               |      o demo.anim     |
|               |      o demo.rig      |
|_______________|      |_______________|
```

> I'm confused..

Don't worry, this will make more sense once we get a little bit further in learning about Pyblish. All you need to remember from this is that each plug-in carries a list of supported families and that all instances carries exactly one (1) family that may or may not match any of the available plug-ins.

### Why Did the Publish Go There?

> Because the plug-in `extract_as_ma` put it there.

Well, if you remember from the **How It Works**, once selection and validation was complete, extraction took over. One of the extractors - specifically, one called `extract_as_ma` - is responsible for putting the files where they ended up.

Remember, the primary responsibility of an extractor is *getting data out of an application*. It doesn't have much concern for exactly where the data ends up, as that is not within its responsibilities. Instead, this responsibility is delegated to conformers.

> Why couldn't the extractor just put the files where I want them right away?

They most certainly could, this is merely a guideline. The separation is made due to cases where you have one or more things happening to content once it exits an application.

1. Data is moved to one location
1. Data is archived in another location
1. The event is logger with a task tracking solution

For example, ask yourself these questions.

- What about when the network is down and it can't move the files to where they belong? 
- What about when the internet is down and the event can't be logged?
- Should this stop the application from exporting the data?

These are concerns well suited for conformers.

### Where Did the Naming Convention Come From?
-
> From the plug-in `validate_naming_convention`.

By now, you can probably answer the remaining questions yourself. But there is one important aspect I'd like to point out regarding the naming convention plug-in.

The reason this naming convention was applied to "gollum_GEO" was because we specified that this cube was of family "demo.model".

We associated this family with our cube and in effect said "associate this particular naming convention to this cube".

## Conclusion

Ok, time for a breather. 

We've covered a lot of ground here but if there is one thing I'd like you to take with you it is that the manner in which we just published your first instance is fully dictated by the plug-ins currently exposed to Pyblish by the time you initiate your publish and that the plug-ins we've used today are just demos.

Pyblish is a "eat your own dog-food" library in that anything it does it does in the same manner you would do it if you were the one implementing the behaviour. We think this is important and it keeps us honest and our implementations open to learning and modification.

You're probably very excited about writing your own plug-ins by now, so let's do that! If you've saved your work (you'll need it next), read on.
