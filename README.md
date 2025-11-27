# 🧪 FloginFE_BE – Ứng dụng Đăng nhập & Quản lý Sản phẩm

**Môn học:** Kiểm Thử Phần Mềm

---

## Project guide

- [Project guide](PROJECT_en.md)

### Simple workflow for deploying static content to GitHub Pages

- name: Deploy static content to Pages
  - https://bhbghghbgb.github.io/FloginFE_BE/

## HTTPS Setup (Local Demo)

This project includes a minimal HTTPS setup using **Nginx** and a **self-signed certificate**.  
It allows you to access the frontend at `https://localhost` and proxy API requests securely to the backend.

### What to Expect

- When you run the project, Nginx will serve the frontend on **https://localhost**.
- All requests to `/api/...` will be forwarded to the backend service.
- Because we use a **self-signed certificate**, your browser will warn that the connection is not trusted.

### Generating Your Own Certificate

1. Go to the `certs/` folder.
2. Run:
   ```bash
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout nginx-selfsigned.key \
     -out nginx-selfsigned.crt \
     -config openssl.conf
   ```

### Certificate Files

- The certificate and key are stored in the `certs/` folder:
  - `nginx-selfsigned.crt` → the certificate
  - `nginx-selfsigned.key` → the private key
- These files are mounted into the Nginx container at `/etc/nginx/certs/`.

### Trusting the Certificate

If you want your browser to stop warning about the certificate:

1. Open the file `certs/nginx-selfsigned.crt`.
2. Import it into your operating system’s trusted certificates:
   - **Windows**: Run `certmgr.msc`, import into "Trusted Root Certification Authorities".
   - **macOS**: Open "Keychain Access", import into "System" keychain, set to "Always Trust".
   - **Linux**: Copy to `/usr/local/share/ca-certificates/` and run `sudo update-ca-certificates`.
3. Restart your browser.

After trusting the certificate, `https://localhost` will load without warnings.

### Important Note

- This setup is for **local development and learning** only.
- In production, you should use a real domain and a certificate from a trusted authority (e.g., Let’s Encrypt).
