# JomHack-Varsity-Challenge-2025-Beninging



## Table of Contents

- [Clone Project](#clone-project)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [1. Backend Setup (Flask)](#1-backend-setup-flask)
  - [2. Frontend Setup (React)](#2-frontend-setup-react)
- [Running Both Servers](#running-both-servers)
- [Testing](#testing)



## Clone project
```
https://github.com/Kelocker/JomHack-Varsity-Challenge-2025-Beninging.git
```

## Project Structure
After setting up:
```
UM-HACKATHON-2025-BENINGING/
├── server/         # Flask backend
│   ├── app.py
│   ├── venv
│   └── requirements.txt
└── frontend/       # React frontend
    ├── src/
    ├── public/
    └── package.json
├── .gitignore
├── readme.md
```

## Setup Instructions
### 1. Backend Setup (Flask)
```
cd server
```

Create a virtual environment:
```
python -m venv venv
```

Activate the virtual environment:
```
venv\Scripts\activate
```

⚠️ If You Get This Error:
```
venv\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system.
```

Temporary fix (safe for development):
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

Permanent fix (use with caution):
```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Install dependencies:
```
pip install -r requirements.txt
```


Start backend
```
python app.py
```

### 2. Frontend Setup (React)
Open a split terminal or a new terminal tab/window, then:
```
cd frontend
```

Install React dependencies:
```
npm install
```

Start the React development server:
```
npm run start
```