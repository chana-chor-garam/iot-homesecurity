from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import smtplib, random, os, time, requests
from pymongo import MongoClient

app = Flask(__name__)
app.secret_key = os.urandom(24)

# --- MongoDB setup ---
MONGO_URI = "mongodb+srv://lightbolt129:FP3nSKjHJr5h7HkC@hs.rvpyv8d.mongodb.net/hs?retryWrites=true&w=majority"
mongo = MongoClient(MONGO_URI)
emails_col = mongo.hs.emails

# --- Email / OTP config ---
SENDER_EMAIL    = "light.bolt129@gmail.com"
SENDER_PASSWORD = "sdjyadjskalwzofg"  
THINGSPEAK_API_KEY = "KKPK57UXMU22DRQP"
THINGSPEAK_URL     = "https://api.thingspeak.com/update"

def send_otp(email):
    otp = str(random.randint(100000, 999999))
    session["otp"] = otp
    session["otp_expiry"] = time.time() + 120
    session["email"] = email

    body    = f"Your OTP is: {otp}\n\nDo not share this with anyone."
    message = f"Subject: Your OTP Code\n\n{body}"

    try:
        s = smtplib.SMTP("smtp.gmail.com", 587)
        s.starttls()
        s.login(SENDER_EMAIL, SENDER_PASSWORD)
        s.sendmail(SENDER_EMAIL, email, message)
        s.quit()
        return True
    except Exception as e:
        print("SMTP error:", e)
        return False

def update_thingspeak(val):
    params = {'api_key': THINGSPEAK_API_KEY, 'field1': val}
    try:
        r = requests.get(THINGSPEAK_URL, params=params, timeout=5)
        return r.status_code==200
    except:
        return False

# --- Flask routes ---
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/emails")
def api_emails():
    docs = list(emails_col.find({}, {"_id":0,"email":1}))
    return jsonify(docs)

@app.route("/send-otp", methods=["POST"])
def send_otp_route():
    email = request.form.get("email")
    if send_otp(email):
        return redirect(url_for("verify"))
    return "❌ Failed to send OTP", 500

@app.route("/verify")
def verify():
    expiry = session.get("otp_expiry",0)
    rem = max(0, int(expiry - time.time()))
    if rem==0:
        session.clear()
        return redirect(url_for("home"))
    return render_template("verify.html", remaining_time=rem)

@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    user = request.form.get("otp","")
    if time.time()>session.get("otp_expiry",0):
        return "❌ OTP expired"
    if user==session.get("otp"):
        ok = update_thingspeak(0)
        return f"✅ Verified. ThingSpeak updated? {ok}"
    return "❌ Wrong OTP"

@app.route("/resend-otp", methods=["POST"])
def resend_otp():
    return redirect(url_for("send_otp_route"))

if __name__=="__main__":
    app.run(debug=True)
