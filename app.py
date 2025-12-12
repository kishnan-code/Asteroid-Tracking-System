from flask import Flask, render_template, request
import joblib
import numpy as np
import os

import pandas as pd

app = Flask(__name__)

# Load Model
model = joblib.load('astronaut_health_model.pkl')

# Load Dataset for Averages (Global context)
df = pd.read_csv('astronaut_health_dataset.csv')
features_list = ['respiration_rate', 'carbs_intake', 'water_intake', 'radiation', 
                 'blood_pressure_sys', 'oxygen_level', 'sleep_hours', 
                 'blood_pressure_dia', 'cabin_temperature', 'mood_score']
averages = df[features_list].mean().to_dict()

from datetime import datetime

# Global history storage
history = []

@app.route('/')
def home():
    return render_template('form.html')

@app.route('/dashboard')
def dashboard():
    # Default dashboard view (EDA)
    images = ['correlation_heatmap.png', 'health_score_dist.png', 'top_features.png']
    return render_template('dashboard.html', images=images, mode='eda', history=history)

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        name = request.form.get('name', 'Astronaut')
        
        # Get data from form and create a dictionary
        input_data = {
            'respiration_rate': float(request.form['respiration_rate']),
            'carbs_intake': float(request.form['carbs_intake']),
            'water_intake': float(request.form['water_intake']),
            'radiation': float(request.form['radiation']),
            'blood_pressure_sys': float(request.form['blood_pressure_sys']),
            'oxygen_level': float(request.form['oxygen_level']),
            'sleep_hours': float(request.form['sleep_hours']),
            'blood_pressure_dia': float(request.form['blood_pressure_dia']),
            'cabin_temperature': float(request.form['cabin_temperature']),
            'mood_score': float(request.form['mood_score'])
        }
        
        # Prepare feature vector for model (must match order)
        feature_vector = [input_data[f] for f in features_list]
        
        # Predict
        prediction = model.predict([feature_vector])[0]
        
        # Calculate Gaps (Input - Average)
        gaps = {k: input_data[k] - averages[k] for k in input_data}
        
        # Add to history
        record = {
            'name': name,
            'prediction': round(prediction, 2),
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'details': input_data
        }
        history.insert(0, record) # Add to beginning
        
        return render_template('dashboard.html', 
                               mode='prediction',
                               name=name,
                               prediction=round(prediction, 2),
                               input_data=input_data,
                               averages=averages,
                               gaps=gaps,
                               images=['correlation_heatmap.png', 'health_score_dist.png', 'top_features.png'],
                               history=history)
    
    return render_template('form.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
