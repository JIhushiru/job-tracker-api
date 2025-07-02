FROM python:3.11-slim

WORKDIR /app

# Copy only requirements first so Docker can cache pip install layer
COPY requirements.txt .

# Install dependencies only if requirements.txt changed
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

ENV PYTHONPATH=/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
