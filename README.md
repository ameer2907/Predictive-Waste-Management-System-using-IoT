# AI-Driven Predictive Waste Management System

An intelligent waste classification system that uses Deep Learning to automatically identify waste type and suggest the correct disposal method. This project supports urban sustainability by helping users segregate waste into biodegradable, recyclable, and general waste categories.

---

## Overview

This system classifies waste images into three main categories:

* **Biodegradable** – Organic waste that decomposes naturally
* **Non-Biodegradable (Recyclable)** – Materials that can be processed and reused
* **Trash** – Mixed or non-recyclable waste requiring landfill or manual sorting

The model is trained using a custom dataset and optimized for fast, real-time predictions suitable for demo and practical applications.

---

## Classification Logic

### Biodegradable (Green Bin)

Includes:

* Paper
* Cardboard

Suggested Action: Compost / Organic Waste Disposal

---

### Non-Biodegradable (Recycling Bin)

Includes:

* Plastic
* Glass
* Metal

Suggested Action: Send to Recycling

---

### Trash (General Waste)

Includes:

* Mixed waste
* Contaminated or non-recyclable items

Suggested Action: General Waste / Landfill / Manual Sorting

---

## Dataset Structure

```
dataset/
│
├── biodegradable/
│   ├── cardboard/
│   └── paper/
│
├── non_biodegradable/
│   ├── plastic/
│   ├── glass/
│   └── metal/
│
└── trash/
```

Data augmentation techniques such as rotation, flipping, zooming, and brightness adjustment were used to improve model accuracy and generalization.

---

How to Run the Project:

1. Clone the Repository

Open terminal or command prompt:

git clone <your-github-repo-link>
cd <project-folder>

2. Create Virtual Environment (Recommended)

Windows:

python -m venv venv
venv\Scripts\activate


Mac/Linux:

python3 -m venv venv
source venv/bin/activate

3. Install Required Libraries
pip install -r requirements.txt


If you don’t have a requirements file, install manually:

pip install tensorflow keras flask numpy pillow opencv-python

4. Add Dataset

Make sure your dataset folder is inside the project directory:

project/
│
├── dataset/
│   ├── biodegradable/
│   ├── non_biodegradable/
│   └── trash/

5. Train the Model (If Needed)
python train.py


This will generate:

model.h5


If you already trained the model, you can skip this step.

6. Run the Application

If using Flask backend:

python app.py


You will see:

Running on http://127.0.0.1:5000


Open browser and go to:

http://127.0.0.1:5000

---

## Features

* AI-based image classification
* Real-time prediction (fast inference)
* Confidence score display
* Disposal recommendation based on waste type
* Upload image or capture via camera
* “Classify Another Image” option for continuous testing
* Professional dark navy user interface
* Dashboard-ready architecture for IoT integration

---

## Model Details

* Transfer Learning (MobileNetV2 / EfficientNet / ResNet)
* Image preprocessing and normalization
* Class balancing and augmentation
* Optimized for high accuracy and demo performance

---

## User Workflow

1. Open the Classification page
2. Upload or capture a waste image
3. The system analyzes the image
4. Displays:

   * Predicted Category
   * Confidence Percentage
   * Disposal Recommendation
5. Click **Classify Another Image** to test more samples

---

## Application Use Cases

* Smart waste segregation systems
* IoT-enabled smart bins
* Urban waste monitoring platforms
* Environmental awareness tools
* Educational and research demonstrations

---

## Technology Stack

* Python
* TensorFlow / Keras or PyTorch
* React / Web Interface
* Tailwind / Modern UI Design
* Deep Learning (CNN + Transfer Learning)

---

## Future Enhancements

* Food waste and organic waste expansion
* Real-time camera detection
* IoT smart bin integration
* Waste level prediction and analytics dashboard
* Cloud deployment

---

## Project Goal

To support sustainable waste management by combining Artificial Intelligence and IoT concepts for accurate waste identification, efficient segregation, and smarter urban environmental solutions.

---
