# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker caching
COPY package*.json ./

# Install dependencies using npm ci (faster & ensures exact versions)
RUN npm ci --only=production

# Copy the rest of your application code
COPY . .

# Expose port 3000 (if using Next.js or Vite, check correct port)
EXPOSE 3000

# Set environment variables for production (if applicable)
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "dev"]
