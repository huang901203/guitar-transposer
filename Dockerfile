# 1. 使用 Nginx 這個輕量級的網頁伺服器作為我們的基礎環境
FROM nginx:alpine

# 2. 把你 VS Code 專案裡的所有檔案 (.)，複製到容器裡的預設網頁資料夾
COPY . /usr/share/nginx/html

# 3. 宣告這個容器會對外開放 80 埠 (網頁的預設通道)
EXPOSE 80