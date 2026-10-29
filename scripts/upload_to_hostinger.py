import ftplib
import os
import sys

host = "145.223.17.122"
user = "u867784814.jenifas.navigotechsolutions.com"
password = r"!~h=|@Bck!zqDN7g"
local_dir = r"d:\Jenefas\dist"

print(f"Connecting to {host} as {user}...")
ftp = ftplib.FTP(timeout=30)
ftp.connect(host, 21)
ftp.login(user, password)
print("Connected successfully!")
print("Current remote dir:", ftp.pwd())

# 1. Delete default.php if present
try:
    ftp.delete("default.php")
    print("Deleted placeholder default.php")
except Exception as e:
    print("default.php delete note:", e)

def upload_directory(local_path, remote_path):
    print(f"\nProcessing dir: {local_path} -> {remote_path}")
    
    # Ensure remote directory exists
    try:
        ftp.cwd(remote_path)
    except Exception:
        # Create directory
        parts = remote_path.strip("/").split("/")
        cur = ""
        for p in parts:
            cur += "/" + p
            try:
                ftp.cwd(cur)
            except Exception:
                ftp.mkd(cur)
                ftp.cwd(cur)

    # List local items
    items = sorted(os.listdir(local_path))
    for item in items:
        full_local = os.path.join(local_path, item)
        if os.path.isdir(full_local):
            sub_remote = f"{remote_path.rstrip('/')}/{item}"
            upload_directory(full_local, sub_remote)
            ftp.cwd(remote_path)
        else:
            print(f"  Uploading: {item} ...", end=" ", flush=True)
            with open(full_local, "rb") as f:
                ftp.storbinary(f"STOR {item}", f)
            print("OK")

# Start upload into /public_html
upload_directory(local_dir, "/public_html")

print("\nListing remote /public_html:")
ftp.cwd("/public_html")
ftp.retrlines("LIST")

ftp.quit()
print("\nAll files uploaded to Hostinger successfully!")
