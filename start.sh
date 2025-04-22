#!/bin/bash

# Create tmux session
tmux new-session -d -s myapp

# Pane 1: Client Dev Server (Inside Docker)
tmux send-keys -t myapp "cd /app/client && bun run dev" C-m

# Pane 2: PDF Server (Inside Docker)
tmux split-window -v -t myapp
tmux send-keys -t myapp "cd /app/client/src/pages/pdfPage && node server.js" C-m

# Pane 3: Main Server (Inside Docker)
tmux split-window -h -t myapp
tmux send-keys -t myapp "cd /app/server && node server.js" C-m

# Adjust layout to tiled format for better view
tmux select-layout -t myapp tiled

# Attach to the tmux session
tmux attach-session -t myapp

echo "The client and server are running inside Docker."
echo "You can manually start the AI Tutor locally on your machine."
