# 使用輕量級的 Nginx 伺服器
FROM nginx:alpine

# 將我們的靜態網頁檔案複製到 Nginx 預設目錄
COPY . /usr/share/nginx/html

# 開放 80 連接埠
EXPOSE 80