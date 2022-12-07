import os
from flask import Flask, render_template, redirect, session, request
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.route("/", methods=["GET","POST"])
def index():
    return render_template("index.html")

@app.route("/register", methods=["GET","POST"])
def register():
    return render_template("register.html")

@app.route("/login", methods=["GET","POST"])
def login():
    return render_template("login.html")

@app.route("/leaderboards", methods=["GET", "POST"])
def leaderboards():
    return render_template("leaderboards.html")