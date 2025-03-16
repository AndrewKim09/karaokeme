from flask import Flask, request, jsonify, send_file
import os
import subprocess
from werkzeug.utils import secure_filename  # type: ignore
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"

CORS(app)  # Enable CORS

# Ensure folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/separate", methods=["POST"])
def separate_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    output_path = os.path.join(OUTPUT_FOLDER, os.path.splitext(filename)[0])

    # Run Spleeter (2 stems: vocals + instrumentals)
    command = [
        r"C:\Users\andre\anaconda3\envs\myenv\Scripts\spleeter.exe",
        "separate",
        "-p",
        "spleeter:2stems",
        "-o",
        OUTPUT_FOLDER,
        filepath
    ]

    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        print("Spleeter Output:", result.stdout)  # Debugging output
    except subprocess.CalledProcessError as e:
        print("Spleeter Error:", e.stderr)  # Print the actual error
        return jsonify({"error": "Spleeter failed", "details": e.stderr}), 500

    # Get output files
    vocal_path = os.path.join(output_path, "vocals.wav")
    instrumental_path = os.path.join(output_path, "accompaniment.wav")

    if not os.path.exists(vocal_path) or not os.path.exists(instrumental_path):
        return jsonify({"error": "Separation failed"}), 500

    return jsonify({
        "vocals": f"/download/{os.path.basename(output_path)}/vocals.wav",
        "instrumental": f"/download/{os.path.basename(output_path)}/accompaniment.wav"
    })

@app.route("/download/<path:filename>", methods=["GET"])
def download_file(filename):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)
