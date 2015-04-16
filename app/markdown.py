import re
import misaka

import pygments
import pygments.lexers
import pygments.formatters


def sluggify(s):
    was = ""
    ret = ""
    for c in s:
        if re.match(r"\w", c):
            ret += c
            was = ""
        elif was == "":
            ret += "-"
            was = "-"
    return ret.strip("-").lower()


class PygmentsRenderer(misaka.HtmlRenderer):
    def header(self, header, n):
        """Add id"s to headers"""
        header = header.strip()
        slug = sluggify(header)
        return "\n<h{n} id=\"{slug}\">{header}</h{n}>\n".format(
            n=n,
            slug=slug,
            header=header)

    def block_code(self, text, lang):
        """Append syntax highlighting to code-blocks using pygments"""

        if not lang:
            return "\n<pre><code>%s</code></pre>\n" % text.strip()

        lexer = pygments.lexers.get_lexer_by_name(lang, stripall=True)
        formatter = pygments.formatters.HtmlFormatter()
        return pygments.highlight(text, lexer, formatter)


markdown_renderer = PygmentsRenderer()
markdown = misaka.Markdown(
    markdown_renderer,
    extensions=misaka.EXT_FENCED_CODE
    | misaka.EXT_NO_INTRA_EMPHASIS
    | misaka.EXT_AUTOLINK)


# Expose rendering method
render = markdown.render
