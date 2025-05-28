FROM node:20.18

WORKDIR /app

# Copy package files và cài dependencies
COPY package*.json ./
RUN npm install

# Nếu bạn cần PM2, cài đặt nó toàn cục
RUN npm install -g pm2

# Copy toàn bộ code (trừ những thứ đã bị loại trừ trong .dockerignore)
COPY . .

# Tạo thư mục logs nếu chưa có
RUN mkdir -p logs

EXPOSE 4000

# Chạy app bằng PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
