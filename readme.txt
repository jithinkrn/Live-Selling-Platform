How to run the product in local:

1. Run Spring Boot back-end server (make sure MySql service is already running and change the username/password in application.properties)

2. Run Python flask server for Dashboard Features ML

	I. Set up (Windows Machines)	
    		i.  Install python 3.10 from https://www.python.org/downloads/
    		ii. Download the Pip script, from https://pip.pypa.io/en/stable/installation/
    		iii. Once downled completes, open a command prompt, cd to the folder containing the dowloaded get-pip.py file and run:
       		 py get-pip.py
    		iv. Open Visual Studio Code and Open the PythonFlaskDashboardApi project (File>Open folder> select PythonFlaskDashboardApi)
    		v. Install all dependencies need for the project. Below scrip will install all dependacies automatically. Navigate to the project folder in terminal and run:
       		 pip install -r requirements.txt

    		vi. Start MyhSQL local database if yet started at step 1 (go to Services for windows machines. locatate MySQL and start). Change username and password the follwing part of the code in 'app.py' file and 'preprocess_db_data.py' file to connect to your MySQL

		#local database connection
		#user change to your Mysql account username
		#password change to your Mysql account password

		mydb = mysql.connector.connect(
  		host="localhost",
  		user="gdipsa54",         
 		password="gdipsa54",     
  		database="livestream"
		)


	II. Run the Python Flask APP (Start Server)    
    		i. Once the setup is done, navigate to the PythonFlaskDashboardApi project folder in the terminal and enter the following  to run flask application
       		 flask run
		*For more details on other scripts and features of the application refer to README file saved the project directory

3. Run Android Studio for mobile front-end 
    I. Lombok functionality
        a. Download lombok package for android (https://plugins.jetbrains.com/plugin/6317-lombok/)
        b. Unzip and add the output folder (named lombok-plugin) to the plugins folder of your Android Studio directory
        c. Clean and Rebuild project to allow Lombok annotations across the classes

    II. Generate Agora Tokens for the Stream
        a. Go to https://console.agora.io/ and login as:
            username/email: sa54.team3@gmail.com
            password: NUSTeam3!@#
        b. In the home page, go to Project Management, click Config under the LiveStreamApp module.
        c. Under Features, click "Generate Temp RTC Token"
        d. Under Channel Name, input the name of the Channel (NOTE: Channel, not User/Stream) that you wish to host with (in our demo example, 
                we used James Seah's channel, HighTech Gadgets).
        e. Click "Generate". A Temp Token field will show up. Copy the token using Ctrl + c. (NOTE: Due to the free version of Agora, our app can
                only have one concurrent stream running at a time.)
        f. After copying the token, go to the Android Project, and go to res\values\strings.xml.
        g. Under the string with name="stream-token", paste the token that was generated from the Agora Server.
        NOTE: Tokens generated in this manner are only valid for 24 hours. Expired tokens will not show any video.

    III. Generate Agora Tokens for the Live Chat
        a. Go to https://webdemo.agora.io/token-builder/
        b. Copy the value of string named "appId" in the res\values\strings.xml file in the Android project, and
                paste it under the "appID" field in the Token Builder. 
        b. Copy the value of string named "appCert" in the res\values\strings.xml file in the Android project, and
                paste it under the "appCertificate" field in the Token Builder. 
        c. Type in the username (NOTE: username, not first name/channel name) of the account that you wish to generate a token for.
        d. Copy the value seen at the top of the Token Service panel in the website.
        e. Create a string value in res\values\strings.xml that coordinates with the username you provided. For simplicity, you may generate tokens for the users
                jamesseah and amandachong, as they are already in the system.
        f. Name the string "token-for-<username>" and put the Token as value inside it.
        NOTE: Tokens generated in this manner are valid only for one day, and only after entering the livestream once. New tokens will have to be generated
                after exiting any livestream.

    IV. Connect RetroFit to localhost
        ** By default, the app already runs in the clous via Azure Database. But if the database is being run on local, follow the steps so that the
                app is functional under localhost:
        a. Go the the RetroFitService class under the iss.workshop.livestreamapp.services package
        b. The RetroFitService class will have an final String attribute called API_URL. Change the string value of the attribute to your ip address and product
                (ex. [10.50.4.100 -> ip address, 8080 -> localhost port] ==> http://10.50.4.100:8080)
        c. Save the project and run.

4. Run React web front-end using following commands in the terminal: 
	npm install
	npm start



5. Username and password to login as Seller/Buyer
	*You can also choose to register yourself as seller/buyer

Seller 1
Username: jamesseah
Password: jamesseah

Seller 2
Username: johnseah
Password: johnseah

Seller 3
Username: amandachong
Password: amandachong

Buyer 1
Username: tomtan
Password: tomtan

Buyer 2
Username: melmak
Password: melmak

Buyer3
Username: joelim
Password: joelim




	