import os
import json
import flask.ext.restful

import markdown
import frontmatter


class View(flask.ext.restful.Resource):
    """Retrieve and manipulate views on server.

    A view is similar to a Gollum Wiki-page and is stored
    amongst other views in a single flat folder, accessible
    via their physical name on disk.

    A view may be either:
        - HTML
        - Markdown

    Yet is always returned as HTML.

    """

    @property
    def root_path(self):
        return os.path.join(os.environ["APP_ROOT_PATH"], "static")

    def read_summary(self, view):
        try:
            root, page = os.path.split(view)
        except ValueError:
            root = view

        views_path = os.path.join(self.root_path, "views")
        summary_path = os.path.join(views_path, root, "summary.json")

        try:
            print "Looking for summary in: %s" % summary_path
            with open(summary_path, "r") as f:
                return json.load(f)

        except IOError:
            return {}

    def get(self, view):
        """Retrieve view"""
        try:
            root, page = os.path.split(view)
        except ValueError:
            page = None
            root = view

        views_path = os.path.join(self.root_path, "views")
        view_path = os.path.join(views_path, view)

        metadata = {}
        summary = self.read_summary(view)

        try:
            with open(view_path + ".html", "r") as f:
                html = f.read()
        except IOError:
            try:
                with open(view_path + ".md", "r") as f:
                    content = f.read().strip("\n")  # Remove initial newline(s)

                    metadata = frontmatter.parse(content)
                    content = frontmatter.strip(content)

                    html = markdown.render(content)

            except IOError:
                return {
                    "title": "Not found",
                    "html": "<p>View was not found: %s<p>" % view
                }, 404

        response = {
            "title": view,
            "html": html,
        }

        toc = []
        if "toc" in summary:
            for item in summary["toc"]:
                toc.append({
                    "href": root + "/" + item,
                    "text": item.title(),
                    "isActive": item == page
                })

            response["toc"] = toc

        response.update(metadata)

        return response


def embed(app):
    api = flask.ext.restful.Api(app)
    api.add_resource(View, '/view/<path:view>')
    return api
