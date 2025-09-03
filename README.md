# iot-homesecurity

INTRODUCTION<br>
PROBLEM STATEMENT :<br>
○Traditional security measures like manual locks and basic surveillance cameras
are often inadequate. <br>
○Need for a more intelligent, automated system leveraging IoT technology for
real-time monitoring and alerts. <br>

PROJECT AIM<br>
●Window Motion Detection: Detect motion near windows to monitor for unauthorized entry. <br>
●Access Control: Grant access to the premises only to enrolled residents and track any unauthorized access attempts. Furthermore, one-time access will be granted to guests using otp generation. <br>
●Automated Locking/Unlocking: Integrate actuators to automatically lock or unlock doors and windows
based on predefined security protocols. <br>
●Web Interface: Develop a web interface for real-time alerts and remote control of the security system. <br>
●Break-In Simulation: Simulate break-in scenarios to evaluate and enhance the system's response and
effectiveness. <br>
●Comprehensive Sensor Integration: Utilize a variety of sensors along with a relay module and actuators
for enhanced security functionality. <br>

TECHNOLOGIES INVOLVED<br>
1.Cloud (MongoDB & ThingSpeak): Thingspeak facilitates real-time data collection, analysis, and alert notifications. 
MongoDB stores data like personal details (name and biometric id) and access permissions. <br>
2.Edge Computing (Fingerprint sensor): The R 307 S processes fingerprint data, converts it into templates, and
stores them securely in flash memory for enrollment and matching, ensuring reduced latency and improved privacy. <br>
3.MQTT: Enables real-time communication between devices. Thingspeak acts as MQTT broker. <br>
4.REST API & HTTP: REST is a set of principles for designing networked applications, using HTTP as the protocol
for communication, allowing remote interaction with the security system via web. <br>
5. HTML: To design the web-based dashboard <br>
6. SMTP: An OTP is generated for the guest and sent to their email which they can use to unlock the door. <br>

OUTCOMES
User Categories: <br>
○Residents: Full access. <br>
○Guests who visit on a daily basis: Temporary, limited access (via dashboard). <br>
○One-time Access: Limited access (via otp). <br>
Access Control Features: <br>
○Conditional access to specific areas for guests (e.g., gardener only to the garden). <br>
○Detection of unusual activity and real-time alerts. <br>

DIAGRAMMATIC REPRESENTATION OF CONTROL FLOW  

<img width="1408" height="1600" alt="image" src="https://github.com/user-attachments/assets/e7e24afb-2e5c-4e16-88b2-a8f8aed426dc" />

TECHNOLOGY STACK <br>
The technology stack for our project consists of 4 parts: <br>
1)Front-End <br>
2)Back-End <br>
3)Database <br>

FRONT-END <br>
We have included a website in our project which monitors door and window
status, allows remote locking/unlocking, enrolls residents, sends emails to guest
with the generated OTP, displays intruder alerts with buzzer/ﬂoodlight popups, and
lets users stop alarms or lights by entering a password for secure home control. <br>
The website is designed using <br>
• HTML5 for structure & semantic forms <br>
• CSS3 + Flexbox for responsive card layout and state-based color classes <br>
• Vanilla ES6 JavaScript with Fetch API (async/await), setInterval() polling, DOM manipulation (getElementById,
.innerHTML), and prompt()-based alerts <br>
• Server-side templating (e.g. Jinja/EJS) for OTP pages, served statically via Express <br>

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/d55b818f-d447-45c5-9da4-d4046fd0cfc9" />

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/5ed7a6f5-25ac-4c78-9f3e-a7d19ad66643" />

1. Markup Layer (HTML5) <br>
●Uses semantic elements (`<h1>, <h2>, <div>, <form>, <table>, etc.`) to outline the page structure. <br>
●Tabbed interfaces are implemented by toggling active classes on different `<div>s`. <br>
2. Styling Layer (CSS3) <br>
●Custom CSS: Written in a <style> block—no external frameworks. <br>
●Flexbox for responsive card layout (.cards-container { display: flex; flex-wrap: wrap; gap: 20px; }). <br>
●Utility classes for buttons and status dots (e.g. .lock-button, .door-status-dot) provide consistent look & feel. <br>
●State-based classes (.locked-dot, .unlocked-dot, .window-open, .intruder-closed) encode real-time status in color. <br>
3. Behavior Layer (Vanilla JavaScript / ES6+) <br>
●Module organization: All code in one <script> block, but logically split into sections (doors, windows, intruder, people, emails). <br>
●fetch() API for AJAX calls to your backend (/api/doors, /api/windows, /api/people, etc.). <br>
●Async/Await syntax for clean asynchronous flows. <br>
●Polling loops: setInterval() to refresh status every 5–17 seconds. <br>
●DOM manipulation: <br>

○Querying elements by id to update text and CSS classes. <br>
○Building <option> lists and <tr> rows dynamically using .innerHTML. <br>
Forms & Event Handling: <br>
○addEventListener('submit', …) to intercept form submits. <br>
○prompt() + password check for security alerts. <br>

BACK-END & DATABASE <br>
➔HTTP Protocol: <br>
This protocol is used to read from Thingspeak channel and to interact with the collections and clusters in MongoDB. <br>
➔MQTT Protocol: <br>
This protocol is used to send data from the sensors values to the ThingSpeak. <br>
➔ThingSpeak (Cloud IoT Platform) : <br>
Used to store data, it also uses MQTT protocol making updation to the broker and subscriber easier and also provides a graph to analyze data in an effective data: <br>
-biometric id (sends back the biometric id to be stored in the database for identity and veriﬁcation) <br>
-windows data (0/1 for open/close) <br>
-door (similar to the windows) <br>
-enm (to send signal to the biometric id on weather a biometric is supposed to be taken for storing new biometric or not) <br>
➔MongoDB(Cloud Database): <br>
Store data and use NOSQL as we had no ﬁxed schema for the number of people and the door access provided to people, also lets us store large data eﬃciently using standard HTTP protocols: <br>
-people information <br>
-emails (for the otp) <br>
➔REST API: lock/unlock doors, trigger buzzer/ﬂoodlight, enroll new ﬁngerprints, sends status updates <br>
➔SMTP (Sends Email via Backend) <br>

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/1aaab7b6-c185-4cf2-a93a-e8d117d8f7ce" />

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/75e8c0e5-cbad-459a-98e8-661359db69ad" />

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/088e17b9-6181-4161-92c5-e5fa4d89d2c6" />

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/2e7d2f7f-94a2-4fd0-bd20-c40d6ac26994" />

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/5cc1b0f9-3dcd-46f2-992a-09030606bfdd" />

OTP SYSTEM <br>
Front-end: <br>
• HTML5 for semantic forms & server-injected values <br>
• Fetch API + Promises to load email options dynamically<br>
• Vanilla JS countdown via setTimeout() and redirect<br>
• Standard HTML forms for /send-otp, /verify-otp, /resend-otp<br>
Back-end:<br>
• Python/Flask: full OTP lifecycle (generate, email, session, verify) + ThingSpeak update<br>
• smtplib & requests for SMTP and external REST calls<br>
• PyMongo (MongoDB Atlas) for email storage<br>
• Node/Express: simple JSON API for email list, with static-file & form-body support<br>

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/dd0ee172-4df2-466d-b720-26bae3636737" />

SENSORS:<br>

Biometric Sensor<br>
●Used for locking or unlocking the doors.<br>
●Takes the ﬁngerprint and identiﬁes if it’s a valid ﬁngerprint or not.<br>
●Valid ﬁngerprint is the one that’s enrolled in the sensor.<br>
●Only the ﬁngerprints of house members and daily househelps like cook, maid,
 etc would be enrolled.<br>

Contact Sensor<br>
●Used for knowing the window status.<br>
●We use two contact sensors for one Window.<br>
●One sensor is placed on the sliding panel and the other on the stationary
panel.<br>
●When the two contact sensors are in contact with each other means the
window is closed and else open.<br>
●The window status is always shown on the website.<br>

Ultrasonic and PIR Sensor<br>
●Used for detecting intruder detection through the window.<br>
●PIR sensor detects if a presence is there or not<br>
●And the ultrasonic sensor detects whether the object detected by the
ultrasonic sensor is incoming or outgoing.<br>
●Only if the object is incoming then the intruder is detected and there is a pop
up on the website.<br>

ACTUATORS<br>
Solenoid lock<br>
●Represents the lock of a door<br>
●Opens when a valid ﬁngerprint is detected by the ﬁngerprint sensor or we lock
or unlock it through the website or through otp(for guests).<br>
●The lock status is always shown on the website.<br>

Relay module<br>
controls high powered devices (solenoid lock) using low voltage signals from
low-voltage signals of microcontroller(esp32).<br>

INDICATORS<br>

Flood Lights<br>
Flood lights are high intensity, wide-beam lights used to illuminate large outdoor
areas. This can create fear in the intruder.
When there have been consecutive failed attempts at the main door biometric
sensor then the ﬂood light turns on.
The ﬂood light will only turn off only when we type a password on the website.
This password is only known by the family members.

Buzzer<br>
A buzzer is an electronic component that generates sound, often used for alerts,
alarm in security devices.
When there have been consecutive failed attempts at the garden door biometric
sensor then the buzzer turns on.
The buzzer will only turn off only when we type a password on the website.
This password is only known by the family members.

Micro-Controller
Micro-controller used - esp32 (3 esp32 used in this project)
One esp32 for garden door , connected to buzzer, relay module, ﬁngerprint sensor.
One esp32 for main door, connected to ﬂood light, relay module, ﬁngerprint
sensor.
One esp32 for the window, connected to 2 contact sensors , PIR and Ultrasonic
sensor.

Power Supply
Esp32, the indicators, sensors and the relay module require 5 volt battery for
operation and this is provided by an adapter.
Adapter connects the esp32 to external power supply, and esp32’s VCC pin is used
to power on the other sensors.
The solenoid lock requires 12 Volt battery and this was taken by the main power
supply.
The esp32 here wasn’t connected to the laptop by any usb after the code was
once ﬂashed in it.

NETWORKING TOPOLOGY<br>
1.We have made used 3 ESP-32 MCU as separate nodes to increase scalability
and eﬃciency. This improves reliability by ensuring other ESPs work even if
one fails.<br>
a.Main door<br>
b.Garden door<br>
c.Window<br>
2.All the ESP-32 MCUs are connected to a centralized server, making it a star
topology.<br>
