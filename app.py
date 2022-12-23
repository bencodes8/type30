import os
from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
import sqlite3

from settings import login_required

app = Flask(__name__)

app.config["TEMPLATES_AUTO_RELOAD"] = True

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

conn = sqlite3.connect('keys.db', check_same_thread=False)
db = conn.cursor()

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
        if request.form.get("password") != request.form.get("confirmation"):
            flash("Passwords do not match!")
            return render_template("register.html")
        
        try:
            db.execute("SELECT * FROM users WHERE username = ?", (request.form.get("username"),))
            if db.fetchone() is not None:
                flash("Username already exists")
                return render_template("register.html")
        except:
            db.rollback()    
            
        pw_hash = generate_password_hash(request.form.get("password"))
        db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", (request.form.get("username"), pw_hash))
        conn.commit()
        flash("Succesfully registered!")
        
    return render_template("register.html")

@app.route("/login", methods=["GET","POST"])
def login():
    
    session.clear()
    
    if request.method == "POST":
        try:
            db.execute("SELECT * FROM users WHERE username = ?", (request.form.get("username"),))
            row = db.fetchone()
            print(row)
            if row is None:
                flash("Invalid username")
                return render_template("login.html")
            elif not check_password_hash(row[2], request.form.get("password")):
                flash("Invalid password")
                return render_template("login.html") 
        except:
            db.rollback()
        
        flash("Successfully logged in!")
        return redirect("/")
        
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/boards", methods=["GET", "POST"])
def boards():
    db.execute("SELECT * FROM users")
    test = db.fetchall()
    print(test)
    return render_template("boards.html")
