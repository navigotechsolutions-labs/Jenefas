import os
import subprocess
import glob

assets_dir = r"D:\Jenefas\assets"
out_dir = r"D:\Jenefas\scratch\video_frames"
os.makedirs(out_dir, exist_ok=True)

videos = sorted(glob.glob(os.path.join(assets_dir, "*.mp4")))
print(f"Total videos: {len(videos)}")

for idx, v in enumerate(videos):
    name = os.path.basename(v)
    out_img = os.path.join(out_dir, f"frame_{idx:02d}.jpg")
    cmd = [
        "ffmpeg", "-y", "-ss", "00:00:02", "-i", v,
        "-frames:v", "1", "-q:v", "2", out_img
    ]
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"[{idx:02d}] {name} -> Frame extracted: {os.path.exists(out_img)}")
