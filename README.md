
# Toxic Comment Classification System 

This project is an AI-powered web application that classifies comments as **TOXIC** or **NON-TOXIC** using a fine-tuned transformer model. It consists of three main parts:

-  **Backend** – Express.js server
-  **Model Server** – Python Flask + HuggingFace Transformers
-  **Frontend** – React with TailwindCSS and Framer Motion

---

##  Prerequisites

- Node.js & npm
- Python 3.8+
- pip
- (Optional) `virtualenv`

---

##  Folder Structure

```
.
├── backend/           # Express backend API
├── frontend/          # React frontend
├── model_service/     # Flask model server with transformer model
```

---

##  Step 1: Set up and Run the Model Server (Flask + Transformer)

1. **Open a terminal** and navigate to the model service directory:

   ```bash
   cd model_service
   ```

2. **Create a virtual environment** (only once):

   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:

   - On **Windows**:

     ```bash
     venv\Scripts\activate
     ```

   - On **macOS/Linux**:

     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

5. **Start the model server**:

   ```bash
   python model_server.py
   ```

   > Ensure that `final_toxic_model/` exists in `model_service/`.

---

##  Step 2: Run the Backend Server (Node.js + Express)

1. Open a **new terminal**.

2. Navigate to the backend folder:

   ```bash
   cd backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   nodemon server.js
   ```

   > The backend connects to the model server and exposes an `/api/classify` endpoint.

---

##  Step 3: Start the Frontend (React App)

1. Open **another terminal**.

2. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:5173` in your browser.

---

##  Example Usage (via `curl`)

```bash
curl -X POST http://127.0.0.1:5000/predict -H "Content-Type: application/json" -d "{\"comment\": \"You are a terrible person\"}"
```

Expected response:

```json
{ "prediction": "TOXIC" }
```
