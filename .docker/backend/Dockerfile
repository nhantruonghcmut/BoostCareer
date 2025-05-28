FROM NODE:20.18.0
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY backend/ ./
# Expose the port the app runs on
RUN mkdir -p logs
EXPOSE 4000
CMD ["npm", "run", "start"]