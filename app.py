import os
from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from settings import login_required

app = Flask(__name__)

app.config["TEMPLATES_AUTO_RELOAD"] = True

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET","POST"])
def index():
    return render_template("index.html")

@app.route("/register", methods=["GET","POST"])
def register():
    if request.method == "POST":
        if request.form.get("r-password") != request.form.get("r-confirm"):
            flash("Passwords do not match!")
            return render_template("register.html")
            
    return render_template("register.html")

@app.route("/login", methods=["GET","POST"])
def login():
    session.clear()
    
    return render_template("login.html")

@app.route("/leaderboards", methods=["GET", "POST"])
def leaderboards():
    return render_template("boards.html")