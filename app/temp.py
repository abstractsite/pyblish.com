import misaka
import pygments
import pygments.lexers
import pygments.formatters


class PygmentsRenderer(misaka.HtmlRenderer, misaka.SmartyPants):
    def block_code(self, text, lang):
        if not lang:
            return '\n<pre><code>%s</code></pre>\n' % text.strip()

        lexer = pygments.lexers.get_lexer_by_name(lang, stripall=True)
        formatter = pygments.formatters.HtmlFormatter()
        return pygments.highlight(text, lexer, formatter)


markdown_renderer = PygmentsRenderer()
markdown = misaka.Markdown(
    markdown_renderer,
    extensions=misaka.EXT_FENCED_CODE
    | misaka.EXT_NO_INTRA_EMPHASIS)


print markdown.render("""

# Hello

This is works

```python
def function():
    variable = 5
    return variable
```


""")

