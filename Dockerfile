# Stage 1: Install Dependencies and Build
FROM node:latest as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Stage 2: Production
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app /app

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
