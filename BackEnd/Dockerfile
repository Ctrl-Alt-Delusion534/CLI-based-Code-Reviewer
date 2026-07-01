# Use a lightweight Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application files
COPY src/ ./src/
COPY server.js ./

# Expose the API port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the Express server
CMD ["node", "server.js"]