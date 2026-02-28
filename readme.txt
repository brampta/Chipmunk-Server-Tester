Chipmunk Server Tester version 1.02 from intercode.ca
===========================================================


whats new in version 1.02??==========================================
-not creating new audios each beeb, but reusing already created ones to save on memory
-darker colors!

whats new in version 1.01??==========================================
-the Chipmunk server tester can also test your database on top of just testing your webserver.
.the tester will warn you if DB is down just like if server is down, but a message will indicate that the DB is down instead of giving an apache error code
.the tester also keeps an eye on your processlist and will update you if your processlist contains more than x items
-the messages are now in english (before all the audio was in french)

The Chipmunk Server Tester is a webpage that tests your server every 5 seconds by loading a page from it via xml ajax request. (xmltest.xml)
If the page loads correctly a gentle chipmunk sound is emitted, letting you know that your server is up.
If the page does not load correctly for x times in a row, the Chipmunk Server Tester will start sounding a loud alarm, loud enough to wake you up.



how to install:
simply drop the Chipmunk folder in the root folder of one of the websites on your server and then navigate to yoursite.com/chipmunk in a web browser.

how to configure to test the database too:
by default the Chipmunk server tester will only test your web server because it can do this without requiring any configuration on your part. To setup the tester to test your database as well (recommended) you must edit the settings.php file and enter your DB connection information.