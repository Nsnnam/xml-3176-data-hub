import os
import sys
import shutil
import subprocess

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT_DIR)

print(f"=== Starting Desktop Build for NsN XML DataHub 3176 in {ROOT_DIR} ===")

# 1. Build Vite React frontend
print("\n[Step 1/3] Building Frontend with Vite...")
npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
subprocess.run([npm_cmd, "run", "build"], check=True)

dist_dir = os.path.join(ROOT_DIR, "dist")
if not os.path.exists(dist_dir):
    raise FileNotFoundError("Thư mục dist/ không tồn tại sau khi build.")
print("✓ Frontend built successfully.")

# 2. Package with PyInstaller (--onedir for setup installer)
print("\n[Step 2/3] Bundling with PyInstaller...")
build_desktop_dir = os.path.join(ROOT_DIR, "build_desktop")
releases_dir = os.path.join(ROOT_DIR, "releases")
setup_dir = os.path.join(releases_dir, "setup")
portable_dir = os.path.join(releases_dir, "portable")

os.makedirs(setup_dir, exist_ok=True)
os.makedirs(portable_dir, exist_ok=True)

# Build onedir for Inno Setup
pyinstaller_cmd = [
    sys.executable, "-m", "PyInstaller",
    "--noconfirm",
    "--onedir",
    "--windowed",
    "--name", "NsN_XML_DataHub_3176",
    "--icon", os.path.join(ROOT_DIR, "desktop", "app.ico"),
    "--distpath", build_desktop_dir,
    "--workpath", os.path.join(ROOT_DIR, "build_tmp"),
    "--add-data", f"{dist_dir};dist",
    "--hidden-import", "openpyxl",
    "--hidden-import", "xlsxwriter",
    "--hidden-import", "sqlite3",
    "--hidden-import", "fastapi",
    "--hidden-import", "uvicorn",
    "--hidden-import", "webview",
    "--hidden-import", "tkinter",
    "--hidden-import", "tkinter.filedialog",
    os.path.join(ROOT_DIR, "desktop", "app.py")
]

print(f"Running: {' '.join(pyinstaller_cmd)}")
subprocess.run(pyinstaller_cmd, check=True)
print("✓ PyInstaller bundle created in build_desktop/NsN_XML_DataHub_3176")

# 3. Compile Inno Setup Script
print("\n[Step 3/3] Compiling Inno Setup EXE...")
iscc_paths = [
    r"C:\Users\Admin\AppData\Local\Programs\Inno Setup 6\ISCC.exe",
    r"C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
    r"C:\Program Files\Inno Setup 6\ISCC.exe"
]

iscc_exe = None
for p in iscc_paths:
    if os.path.exists(p):
        iscc_exe = p
        break

if iscc_exe:
    iss_file = os.path.join(ROOT_DIR, "installer", "setup.iss")
    subprocess.run([iscc_exe, iss_file], check=True)
    setup_file = os.path.join(setup_dir, "NsN_XML_DataHub_3176_Setup_v1.1.1.exe")
    if os.path.exists(setup_file):
        size_mb = os.path.getsize(setup_file) / (1024 * 1024)
        print(f"\n=======================================================")
        print(f"🎉 THÀNH CÔNG! ĐÃ TẠO FILE CÀI ĐẶT SETUP EXE:")
        print(f"File: {setup_file}")
        print(f"Dung lượng: {size_mb:.2f} MB")
        print(f"=======================================================")
else:
    print("⚠️ Không tìm thấy ISCC.exe để tạo bộ cài Inno Setup. File chạy trực tiếp nằm tại build_desktop/NsN_XML_DataHub_3176/NsN_XML_DataHub_3176.exe")
