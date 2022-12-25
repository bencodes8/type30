import os
from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
import sqlite3
import json

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

@app.route('/passtime/<string:time>', methods=["GET"])
@login_required
def passTime(time):
    time_info = json.loads(time)
    db.execute("SELECT time FROM users WHERE id = ?", (session["user_id"],))
    users_best_time = db.fetchone()[0]
    if users_best_time is None or time_info < users_best_time:
         db.execute("UPDATE users SET time = ? WHERE id = ?", (time_info, session["user_id"]))
         conn.commit()
    else:
        db.rollback()

    return('/')

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
            
        session["user_id"] = row[0]
        flash(f"Successfully logged in! Welcome back, {row[1]}")
        return redirect("/")
        
    return render_template("login.html")

@app.route("/logout")
@login_required
def logout():
    session.clear()
    return redirect("/")

@app.route("/boards", methods=["GET", "POST"])
def boards():
    in_order = []
    fastest_time = 1000
    
    db.execute("SELECT * FROM users")
    users = db.fetchall()
    print(users)
    
    for user in users:
        if user[3] is not None and user[3] <= fastest_time:
            fastest_time = user[3]
            in_order.insert(0, user)
        elif user[3] is None:
            continue
        else:
            in_order.append(user)
    
    print(in_order)
    
    return render_template("boards.html", in_order=in_order)

if __name__ == "__main__":
    app.run(debug=True)
