# iot-homesecurity

INTRODUCTION
PROBLEM STATEMENT :
○Traditional security measures like manual locks and basic surveillance cameras
are often inadequate.
○Need for a more intelligent, automated system leveraging IoT technology for
real-time monitoring and alerts.

PROJECT AIM
●Window Motion Detection: Detect motion near windows to monitor for unauthorized entry.
●Access Control: Grant access to the premises only to enrolled residents and track any unauthorized
access attempts. Furthermore, one-time access will be granted to guests using otp generation.
●Automated Locking/Unlocking: Integrate actuators to automatically lock or unlock doors and windows
based on predefined security protocols.
●Web Interface: Develop a web interface for real-time alerts and remote control of the security system.
●Break-In Simulation: Simulate break-in scenarios to evaluate and enhance the system's response and
effectiveness.
●Comprehensive Sensor Integration: Utilize a variety of sensors along with a relay module and actuators
for enhanced security functionality.

TECHNOLOGIES INVOLVED
1.Cloud (MongoDB & ThingSpeak): Thingspeak facilitates real-time data collection, analysis, and alert notifications.
MongoDB stores data like personal details (name and biometric id) and access permissions.
2.Edge Computing (Fingerprint sensor): The R 307 S processes fingerprint data, converts it into templates, and
stores them securely in flash memory for enrollment and matching, ensuring reduced latency and improved privacy.
3.MQTT: Enables real-time communication between devices. Thingspeak acts as MQTT broker.
4.REST API & HTTP: REST is a set of principles for designing networked applications, using HTTP as the protocol
for communication, allowing remote interaction with the security system via web.
5. HTML: To design the web-based dashboard
6. SMTP: An OTP is generated for the guest and sent to their email which they can use to unlock the door.

OUTCOMES
User Categories:
○Residents: Full access.
○Guests who visit on a daily basis: Temporary, limited access (via dashboard).
○One-time Access: Limited access (via otp).
Access Control Features:
○Conditional access to specific areas for guests (e.g., gardener only to the garden).
○Detection of unusual activity and real-time alerts.

DIAGRAMMATIC REPRESENTATION OF CONTROL FLOW

<img width="1408" height="1600" alt="image" src="https://github.com/user-attachments/assets/e7e24afb-2e5c-4e16-88b2-a8f8aed426dc" />

TECHNOLOGY STACK
The technology stack for our project consists of 4 parts:
1)Front-End
2)Back-End
3)Database

FRONT-END
We have included a website in our project which monitors door and window
status, allows remote locking/unlocking, enrolls residents, sends emails to guest
with the generated OTP, displays intruder alerts with buzzer/ﬂoodlight popups, and
lets users stop alarms or lights by entering a password for secure home control.
The website is designed using
• HTML5 for structure & semantic forms
• CSS3 + Flexbox for responsive card layout and state-based color classes
• Vanilla ES6 JavaScript with Fetch API (async/await), setInterval() polling, DOM manipulation (getElementById,
.innerHTML), and prompt()-based alerts
• Server-side templating (e.g. Jinja/EJS) for OTP pages, served statically via Express

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/d55b818f-d447-45c5-9da4-d4046fd0cfc9" />

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/5ed7a6f5-25ac-4c78-9f3e-a7d19ad66643" />

1. Markup Layer (HTML5)
●Uses semantic elements (`<h1>, <h2>, <div>, <form>, <table>, etc.`) to outline the page structure.
●Tabbed interfaces are implemented by toggling active classes on different <div>s.
2. Styling Layer (CSS3)
●Custom CSS: Written in a <style> block—no external frameworks.
●Flexbox for responsive card layout (.cards-container { display: flex; flex-wrap: wrap; gap: 20px; }).
●Utility classes for buttons and status dots (e.g. .lock-button, .door-status-dot) provide consistent look & feel.
●State-based classes (.locked-dot, .unlocked-dot, .window-open, .intruder-closed) encode real-time status in color.
3. Behavior Layer (Vanilla JavaScript / ES6+)
●Module organization: All code in one <script> block, but logically split into sections (doors, windows, intruder, people, emails).
●fetch() API for AJAX calls to your backend (/api/doors, /api/windows, /api/people, etc.).
●Async/Await syntax for clean asynchronous flows.
●Polling loops: setInterval() to refresh status every 5–17 seconds.
●DOM manipulation:
●
○Querying elements by id to update text and CSS classes.
○Building <option> lists and <tr> rows dynamically using .innerHTML.
Forms & Event Handling:
○addEventListener('submit', …) to intercept form submits.
○prompt() + password check for security alerts.

BACK-END & DATABASE
➔HTTP Protocol:
This protocol is used to read from Thingspeak channel and to interact with the collections and clusters in MongoDB.
➔MQTT Protocol:
This protocol is used to send data from the sensors values to the ThingSpeak.
➔ThingSpeak (Cloud IoT Platform) :
Used to store data, it also uses MQTT protocol making updation to the broker and subscriber easier and also provides a graph to analyze data in an effective data:
-biometric id (sends back the biometric id to be stored in the database for identity and veriﬁcation)
-windows data (0/1 for open/close)
-door (similar to the windows)
-enm (to send signal to the biometric id on weather a biometric is supposed to be taken for storing new biometric or not)
➔MongoDB(Cloud Database):
Store data and use NOSQL as we had no ﬁxed schema for the number of people and the door access provided to people, also lets us store large data eﬃciently using standard HTTP protocols:
-people information
-emails (for the otp)
➔REST API: lock/unlock doors, trigger buzzer/ﬂoodlight, enroll new ﬁngerprints, sends status updates
➔SMTP (Sends Email via Backend)

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/1aaab7b6-c185-4cf2-a93a-e8d117d8f7ce" />

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/75e8c0e5-cbad-459a-98e8-661359db69ad" />

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/088e17b9-6181-4161-92c5-e5fa4d89d2c6" />

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/2e7d2f7f-94a2-4fd0-bd20-c40d6ac26994" />

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/5cc1b0f9-3dcd-46f2-992a-09030606bfdd" />

OTP SYSTEM
Front-end:
• HTML5 for semantic forms & server-injected values
• Fetch API + Promises to load email options dynamically
• Vanilla JS countdown via setTimeout() and redirect
• Standard HTML forms for /send-otp, /verify-otp, /resend-otp
Back-end:
• Python/Flask: full OTP lifecycle (generate, email, session, verify) + ThingSpeak update
• smtplib & requests for SMTP and external REST calls
• PyMongo (MongoDB Atlas) for email storage
• Node/Express: simple JSON API for email list, with static-file & form-body support

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/dd0ee172-4df2-466d-b720-26bae3636737" />

SENSORS:

Biometric Sensor
●Used for locking or unlocking the doors.
●Takes the ﬁngerprint and identiﬁes if it’s a valid ﬁngerprint or not.
●Valid ﬁngerprint is the one that’s enrolled in the sensor.
●Only the ﬁngerprints of house members and daily househelps like cook, maid,
●etc would be enrolled.

Contact Sensor
●Used for knowing the window status.
●We use two contact sensors for one Window.
●One sensor is placed on the sliding panel and the other on the stationary
panel.
●When the two contact sensors are in contact with each other means the
●window is closed and else open.
●The window status is always shown on the website.

Ultrasonic and PIR Sensor
●Used for detecting intruder detection through the window.
●PIR sensor detects if a presence is there or not
●And the ultrasonic sensor detects whether the object detected by the
ultrasonic sensor is incoming or outgoing.
●Only if the object is incoming then the intruder is detected and there is a pop
up on the website.

ACTUATORS
Solenoid lock
●Represents the lock of a door
●Opens when a valid ﬁngerprint is detected by the ﬁngerprint sensor or we lock
or unlock it through the website or through otp(for guests).
●The lock status is always shown on the website.

Relay module
controls high powered devices (solenoid lock) using low voltage signals from
low-voltage signals of microcontroller(esp32).

INDICATORS

Flood Lights
Flood lights are high intensity, wide-beam lights used to illuminate large outdoor
areas. This can create fear in the intruder.
When there have been consecutive failed attempts at the main door biometric
sensor then the ﬂood light turns on.
The ﬂood light will only turn off only when we type a password on the website.
This password is only known by the family members.

Buzzer
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

NETWORKING TOPOLOGY
1.We have made used 3 ESP-32 MCU as separate nodes to increase scalability
and eﬃciency. This improves reliability by ensuring other ESPs work even if
one fails.
a.Main door
b.Garden door
c.Window
2.All the ESP-32 MCUs are connected to a centralized server, making it a star
topology.
