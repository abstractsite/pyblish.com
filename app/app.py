# Standard libraries
import os
import logging

# Dependencies
import flask
import flask.ext.restful

# Local
import routes.home

logging.basicConfig(format="%(asctime)-15s %(message)s")
logging.getLogger().setLevel(logging.DEBUG)

app = flask.Flask(__name__)
app.route("/", defaults={"p": ""})(routes.home.route)
app.route("/<path:p>")(routes.home.route)  # All paths route to index.html
os.environ["APP_ROOT_PATH"] = app.root_path


def debug(app):
    os.environ["DEVELOP"] = "true"
    app.debug = True
    return app.run()


def production(app):
    return app.run()


if __name__ == "__main__":
    debug(app)
