****NOTE - Change env to .env before running the server**** <br> <br>
**Introduction** <br>
Filing is an file application where you can get links for your files to download and share with anyone. 
This application uses node.js through express and aws services on the backend and utilises mongodb as a database which stores all the links generated for download.

**Technologies Used** <br>
On the frontend it used technologies like bootstrap as a css framework and jquery.
On the interface, we first select the file and then a alert box for the file selected appears. Then we can click the Submit button and application will give us the link.
We can also check all the links generated by clicking the Get Link button. 
The link generated is valid upto 7 days and after that the link will stop working.
It can also only take in file types like .png, .jpg, .jpeg and .pdf.

**Run Locally**<br>
In order to run this app locally, you have to install all require modules.
**Prerequisites** <br>
Install node.js
**Setup Method one** <br>
1. Install and open VS Code.
2. Open the dowloaded folder in VS code. You will have access to all the files.
3. At the bottom you will see a window and one option labled **Terminal**. Click to access the Terminal. Or press Ctrl + Shift + ~ .
4. In the terminal, first write "npm install" and it will automatically install all the prerequisite modules/files to run the application.
5. Now write "node app.js" to run the app and it will say "Server Started" in the Terminal.
6. After this the application is hosted locally on port 3000.On your browser, on "http://localhost:3000/" the application will be running .
**Setup Method two (Without VS Code)** <br>
1. Open Terminal on your mac or Command Prompt on your windows.
2. Cd to the directory where the downloaded folder is located, like this - "cd <directory name>"
3. For example, If the directory is on Desktop, command would be "cd Desktop/filing" .
4. Run "npm install" to install all required modules/files.
5. Write "node app.js".
6. After this the application is hosted locally on port 3000 and it will say "Server Started".
7. So on your browser go to "http://localhost:3000/" and your application will start running smoothly.
