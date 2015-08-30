Project Design Document
=======================

Project Name
------------
English: git 

Target User
-----------
Editors unfamiliar with Traditional Chinese who have to edit text in Traditional Chinese with utmost orthographical accuracy.

Value Proposition
-----------------
Achieve better accuracy than Automatic Simplified-to-Traditional Chinese conversion with human involvement.

Flow of Information
-------------------
1. User feeds Text in Simplified Chinese into the frontend;
2. The frontend passes the text to the backend;
3. The backend, using a conversion engine and a dictionary, transforms the text into Traditional Chinese;
4. The backend returns three things to frontend -
i. the Text in Traditional Chinese,
ii. all changes made, and
iii. notes about changes that could go wrong, usually one-to-multiple conversions;
5. The frontend displays the Text in Traditional Chinese, highlights the changes, and shows options for each un-confirmed changes;
6. The user inspect the changes and revise accordingly; and
7. The user gets the inspected Text in Traditional Chinese.