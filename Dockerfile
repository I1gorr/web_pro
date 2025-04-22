# Use node base image
FROM node:18 AS app

# Install build tools and dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libncurses-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    wget \
    curl \
    llvm \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libxml2-dev \
    libxmlsec1-dev \
    libffi-dev \
    liblzma-dev \
    tmux \
    git \
    python3.11 \
    python3.11-venv \
    python3-pip

# Link Python 3.11 and pip
RUN ln -s /usr/bin/python3.11 /usr/local/bin/python3.11 && \
    ln -s /usr/bin/python3.11 /usr/local/bin/python3 && \
    ln -s /usr/bin/pip3 /usr/local/bin/pip3.11 && \
    ln -s /usr/bin/pip3 /usr/local/bin/pip

# Install required Python packages globally (without a virtual environment), passing --break-system-packages
RUN pip install --no-cache-dir --break-system-packages \
    fastapi \
    "pydantic<2.6" \
    pymupdf \
    python-docx \
    langchain-ollama \
    uvicorn

# Set working directory
WORKDIR /app

# Copy application files
COPY ./client /app/client
COPY ./server /app/server
COPY start.sh /app/start.sh
COPY aiTutor.py /app/aiTutor.py
RUN chmod +x /app/start.sh

# Install Bun (client-side JS package manager)
RUN curl -fsSL https://bun.sh/install | bash
RUN ln -sf /root/.bun/bin/bun /usr/local/bin/bun

# Install frontend and backend dependencies
WORKDIR /app/client
RUN bun install

WORKDIR /app/server
RUN npm install

# Set back to root app directory
WORKDIR /app

# Start everything
CMD ["bash","/app/start.sh"]
