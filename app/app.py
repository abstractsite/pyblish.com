# Standard libraries
import os
import logging

# Dependencies
import flask
import flask.ext.restful

# Local
import markdown
import frontmatter
import routes.home

logging.basicConfig(format="%(asctime)-15s %(message)s")
logging.getLogger().setLevel(logging.DEBUG)

app = flask.Flask(__name__)
app.route("/", defaults={"p": ""})(routes.home.route)
app.route("/<path:p>")(routes.home.route)  # All paths route to index.html


api = flask.ext.restful.Api(app)


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

    def get(self, view):
        """Retrieve view"""
        root_dir = os.path.join(app.root_path, "static", "views")
        view_path = os.path.join(root_dir, view)

        metadata = {}

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

        response.update(metadata)

        return response


api.add_resource(View, '/view/<path:view>')


def debug(app):
    os.environ["DEVELOP"] = "true"
    app.debug = True
    return app.run()


def production(app):
    return app.run()


if __name__ == "__main__":
    debug(app)
