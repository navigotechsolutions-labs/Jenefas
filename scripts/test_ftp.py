import ftplib

host = "145.223.17.122"
password = r"!~h=|@Bck!zqDN7g"

candidates = [
    "u867784814.jenifas.navigotechsolutions.com",
    "u867784814.jenefas.navigotechsolutions.com",
    "u867784814"
]

for user in candidates:
    try:
        print(f"Connecting with user: '{user}'...")
        ftp = ftplib.FTP(timeout=15)
        ftp.connect(host, 21)
        ftp.login(user, password)
        print(f"SUCCESS with '{user}'!")
        print("PWD:", ftp.pwd())
        print("Listing files:")
        ftp.retrlines("LIST")
        ftp.quit()
        break
    except Exception as e:
        print(f"Failed with '{user}': {e}")
