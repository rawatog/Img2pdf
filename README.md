# 🖼️ Img2PDF Converter

A full-stack web application that converts multiple images into a single PDF file.  
Built using **React (frontend)**, **FastAPI (backend)**, and fully containerized with **Docker + Kubernetes manifests** for deployment.

---

## 🚀 Features

- Upload multiple images (JPG, PNG, JPEG)
- Convert images into a single PDF
- Instant PDF download
- Simple and responsive UI
- Fast backend processing using FastAPI
- Dockerized services
- Kubernetes-ready deployment (frontend + backend + services)

---

## 🏗️ Tech Stack

### Frontend
- React
- Axios
- HTML5 / CSS3

### Backend
- FastAPI
- Python 3.10+
- Pillow (PIL) for image processing
- Uvicorn

### DevOps
- Docker
- Kubernetes (Deployments, Services, Ingress)

---

## 📁 Project Structure


img2pdf/
│
├── frontend/               # React UI
│   ├── src/
│   ├── public/
│   └── Dockerfile
│
├── backend/               # FastAPI service
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   └── utils/
│   ├── requirements.txt
│   └── Dockerfile
│
├── k8s/                   # Kubernetes manifests
│   ├── frontend-deploy.yaml
│   ├── backend-deploy.yaml
│   ├── services.yaml
│   └── ingress.yaml
│
└── README.md
