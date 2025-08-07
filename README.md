🔬 CanScan Lite – Early Skin Cancer Screening App
CanScan Lite is a simple yet powerful tool built to help with early detection of skin cancer. It uses image analysis and symptom input to give users a quick idea of whether a skin lesion looks risky or safe.

👩‍⚕️ For Doctors & Health Workers
Doctors and rural health workers can use the app to:

Upload or capture an image of a skin spot.

Analyze the image with our trained AI model.

Add patient symptoms like bleeding, itching, or color change.

Get a basic Safe or Risk Detected verdict to guide further action.

It's a great add-on in low-resource settings or for quick screenings.

👤 For General Users
CanScan Lite is designed so that anyone — even without a medical background — can easily check if a mole or skin spot looks concerning.

📲 How to Use the App
Download the App

If you're using it locally, download the project from GitHub or run it with tools like VS Code or Bolt AI (if you’re using the Bolt project version).

You’ll need Python installed, along with required libraries (like OpenCV, NumPy, etc.).

Launch the App

The app will open with a clean UI guiding you through the process.

Select a Skin Image

Either upload a picture or use your webcam to capture the affected area.

(Don’t worry – everything stays local to your computer.)

Analyze It

The app compares your image with a reference dataset of skin lesions using trained image processing logic.

Answer a Few Questions

You’ll be asked about symptoms (like bleeding, itching, changes in color/size, etc.).

Get a Result

If the spot seems safe, you’ll see a green “Safe” label.

If it looks risky, a red “Risk Detected” warning shows up with a suggestion to visit a doctor.

📁 About the Dataset
The app was trained/tested using a medical-grade dataset:

ISIC 2016 Skin Lesion Dataset

Contains thousands of real-world annotated images of different types of skin conditions (e.g., melanoma, benign lesions, etc.)

This allows the app to provide reliable and informative analysis for early detection.
🚦 How It Works
Select image or use camera.

App analyzes the lesion.

You answer a few symptom-related questions.

The app gives you a color-coded result:

🟢 Green = Looks Safe

🔴 Red = Risk Detected

💡 Note
This app is meant to assist, not replace doctors. Always consult a medical professional for a proper diagnosis.
