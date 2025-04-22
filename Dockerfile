# Use node for both client and server
FROM node:18 AS app

# Install bun (for client-side)
RUN curl -fsSL https://bun.sh/install | bash
RUN ln -sf /root/.bun/bin/bun /usr/local/bin/bun

# Install tmux (for running tmux commands in the start.sh)
RUN apt-get update && apt-get install -y tmux

# Set the working directory to /app
WORKDIR /app

# Copy both the client and server folders into the container
COPY ./client /app/client
COPY ./server /app/server

# Install client dependencies using bun
WORKDIR /app/client
RUN bun install

# Install server dependencies using npm
WORKDIR /app/server
RUN npm install

# Expose ports for client, server, and any other services
EXPOSE 5001
EXPOSE 5173
EXPOSE 5002

# Copy the start script to /app
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Set working directory to /app
WORKDIR /app

# Start everything using the shell script
CMD ["/bin/bash", "/app/start.sh"]
