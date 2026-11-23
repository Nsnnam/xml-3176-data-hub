import os
import sys
import time
import socket
import threading
import urllib.request
import webview
from server import run_server

def find_free_port(start_port=28176):
    for port in range(start_port, start_port + 100):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.bind(('127.0.0.1', port))
            s.close()
            return port
        except OSError:
            continue
    return start_port

def wait_for_server(url, timeout=10):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url, timeout=1) as response:
                if response.status in (200, 404):
                    return True
        except Exception:
            time.sleep(0.1)
    return False

def main():
    port = find_free_port()
    server_url = f"http://127.0.0.1:{port}"

    # Start FastAPI server in background thread
    server_thread = threading.Thread(target=run_server, args=(port,), daemon=True)
    server_thread.start()

    # Wait for server to be responsive
    wait_for_server(f"{server_url}/api/stats")

    # Launch Native Desktop Window (WebView2)
    window = webview.create_window(
        title="NsN XML DataHub 3176 - Phân Tích Dữ Liệu BHYT Lớn (Desktop Pro)",
        url=server_url,
        width=1400,
        height=900,
        min_size=(1050, 720),
        text_select=True,
        confirm_close=False,
        background_color="#0b1120"
    )

    webview.start(debug=False)
    sys.exit(0)

if __name__ == '__main__':
    main()
