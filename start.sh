#!/bin/bash
export TERM=xterm

# Only start tmux if it isn't already running
if [ -z "$TMUX" ]; then
    tmux new-session -d -s myapp

    tmux send-keys -t myapp "cd /app/client && bun run dev" C-m
    tmux split-window -v -t myapp
    tmux send-keys -t myapp "cd /app/client/src/pages/pdfPage && node server.js" C-m
    tmux split-window -h -t myapp
    tmux send-keys -t myapp "cd /app/server && node server.js" C-m
    tmux split-window -h -t myapp
    tmux send-keys -t myapp "python3.11 -m uvicorn aiTutor:app --reload --host 0.0.0.0 --port 5000" C-m
    tmux select-layout -t myapp tiled
    tmux attach-session -t myapp
else
    echo "Already inside tmux"
fi
