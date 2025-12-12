# Astronaut Health AI 🚀👨‍🚀

**Astronaut Health AI** is a machine learning-powered web application designed to monitor and predict the health status of astronauts during space missions. By analyzing physiological data and environmental factors, the system provides a predicted "Health Score" to help mitigate risks in deep space exploration.

The project features a futuristic **"Cosmo" design**, real-time predictions, and an interactive analytics dashboard.

---

## ✨ Key Features

-   **Health Score Prediction**: Uses a trained Machine Learning model to predict an astronaut's health score based on **10 key indicators**:
    -   Physiological: Respiration Rate, Blood Pressure (Sys/Dia), Oxygen Level, Sleep Hours, Mood Score.
    -   Nutritional: Carbs Intake, Water Intake.
    -   Environmental: Radiation, Cabin Temperature.
-   **Interactive Dashboard**:
    -   Displays the predicted health score with a gauge-like visualization.
    -   **Gap Analysis**: Compares the astronaut's current metrics against the mission average to highlight areas of concern.
    -   **Prediction History**: Tracks recent predictions within the session.
    -   **EDA Visualizations**: Shows dataset insights like Correlation Heatmaps and Feature Importance.
-   **Cosmic UI Theme**: A fully responsive, space-themed interface featuring glassmorphism, floating animations, and a "Cosmo" color palette.

---

## 🛠️ Tech Stack

-   **Backend**: Python, Flask
-   **Machine Learning**: Scikit-Learn / CatBoost, Pandas, NumPy, Joblib
-   **Frontend**: HTML5, Vanilla CSS (Custom "Cosmo" Theme)
-   **Data**: Simulated Astronaut Health Dataset (`astronaut_health_dataset.csv`)

---

## 📂 Project Structure

```
├── app.py                      # Main Flask application entry point
├── astronaut_health_dataset.csv # Dataset used for training and averages
├── astronaut_health_model.pkl   # Pre-trained ML model
├── generate_ppt.py             # Script to auto-generate project presentation
├── train_model.ipynb           # Notebook for model training
├── eda.ipynb                   # Notebook for Exploratory Data Analysis
├── templates/
│   ├── form.html               # Input form for health data
│   └── dashboard.html          # Analytics and results dashboard
└── static/
    └── style.css               # Main stylesheet with Cosmic theme
```

---

## 🚀 Installation & Setup

1.  **Clone the repository** (or ensure you have the project files).

2.  **Install Dependencies**:
    Make sure you have Python installed. Install the required libraries:
    ```bash
    pip install flask pandas numpy joblib scikit-learn catboost
    ```

3.  **Run the Application**:
    ```bash
    python app.py
    ```

4.  **Access the Dashboard**:
    Open your browser and navigate to:
    `http://localhost:5000`

---

## 📊 How to Use

1.  **Home / Input Form**:
    -   Enter the astronaut's name and fill in the observed metrics (e.g., Oxygen Level, Radiation exposure).
    -   Click **"Predict Health Score"**.
2.  **Dashboard**:
    -   View the **Predicted Health Score**.
    -   Review the **Gap Analysis** to see which metrics vary significantly from the norm.
    -   Scroll down to see **Prediction History** and **EDA Charts**.
3.  **Generate PPT**:
    -   Run `python generate_ppt.py` to automatically create a PowerPoint presentation (`Astronaut_Health_AI_Presentation.pptx`) summarizing the project.

---

## 📸 Screenshots

*(Add screenshots of the Form and Dashboard here)*

---

## 🧬 Model Details

The model was trained on a dataset of astronaut health metrics. Key steps included:
1.  **Data Cleaning**: Handling missing values and normalizing data.
2.  **Feature Selection**: Selecting the top 10 most impactful features.
3.  **Model Training**: Using regression algorithms to predict a continuous health score (0-100).
