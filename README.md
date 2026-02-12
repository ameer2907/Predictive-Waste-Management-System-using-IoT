# AI-Driven Predictive Waste Management System using IoT

An intelligent waste classification system that uses Deep Learning to automatically identify the type of waste and suggest the correct disposal method. The system supports sustainable waste management by enabling proper segregation of biodegradable, recyclable, and general waste.

Model Accuracy: Approximately 98–99% using Transfer Learning and augmented dataset.

---

## Project Overview

Improper waste segregation leads to environmental pollution and inefficient recycling. This project uses an AI-based image classification model to automatically categorize waste into three main classes:

* Biodegradable
* Non-Biodegradable (Recyclable)
* Trash (General Waste)

The system provides real-time predictions along with disposal recommendations, making it suitable for smart waste management applications and academic demonstration.

---

## Waste Classification Logic

**Biodegradable (Green Bin)**
Materials that naturally decompose.
Includes:

* Paper
* Cardboard

Suggested Action: Compost or organic disposal.

---

**Non-Biodegradable (Recycling Bin)**
Materials that do not decompose but can be processed and reused.
Includes:

* Plastic
* Glass
* Metal

Suggested Action: Send for recycling.

---

**Trash (General Waste)**
Mixed or contaminated materials that cannot be recycled.

Suggested Action: Landfill or manual sorting.

---

## Dataset Structure

The model is trained using a custom dataset organized into three categories:

* Biodegradable

  * Cardboard
  * Paper

* Non-Biodegradable

  * Plastic
  * Glass
  * Metal

* Trash

To improve model performance, the following data augmentation techniques were applied:

* Rotation
* Horizontal flipping
* Zoom
* Brightness adjustment

---

## Key Features

* AI-based waste image classification
* Real-time prediction with fast inference
* Confidence score display
* Disposal recommendation based on predicted class
* Image upload or camera capture
* Option to classify multiple images continuously
* Professional dark navy user interface
* Designed for future IoT smart bin integration

---

## Model Details

* Convolutional Neural Network with Transfer Learning
* Pretrained architectures such as MobileNetV2 / EfficientNet / ResNet
* Image preprocessing and normalization
* Class balancing and augmentation
* Optimized for high accuracy and demo performance

---

## Technology Stack

Backend:

* Python
* TensorFlow / Keras
* Flask

Frontend:

* React (Vite)
* Tailwind CSS

Artificial Intelligence:

* Deep Learning (CNN)
* Transfer Learning

---

## How to Run the Project

1. Clone the repository from GitHub.
2. Open the project folder in VS Code or terminal.
3. Create and activate a virtual environment.
4. Install the required dependencies using requirements.txt.
5. Place the dataset folder inside the project directory.
6. Train the model using train.py (skip if model.h5 already exists).
7. Run the backend using app.py.
8. Open the application in a browser at:
   [http://127.0.0.1:5000](http://127.0.0.1:5000)

If a React frontend is used:

* Navigate to the frontend folder
* Run npm install
* Start the development server using npm run dev

---

## User Workflow

1. Open the application
2. Upload or capture a waste image
3. The system analyzes the image
4. Displays:

   * Predicted category
   * Confidence percentage
   * Disposal recommendation
5. Use the “Classify Another Image” option to test additional samples

---

## Applications

* Smart waste segregation systems
* IoT-enabled smart bins
* Urban waste monitoring platforms
* Environmental awareness tools
* Academic and research demonstrations

---

## Future Enhancements

* Addition of food and organic waste categories
* Real-time object detection using camera
* IoT sensor integration for smart bins
* Waste level monitoring and analytics dashboard
* Cloud deployment for large-scale use

---

## Project Goal

To develop an AI-powered waste classification system that improves segregation accuracy and supports sustainable urban waste management by integrating Artificial Intelligence and IoT technologies.

---

