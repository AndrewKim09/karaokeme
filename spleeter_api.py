import wave
from flask import Flask, request, jsonify, send_file
import os
import subprocess
import numpy as np
from werkzeug.utils import secure_filename  # type: ignore
from flask_cors import CORS  # Import CORS
import ffmpeg
import whisper
import torch

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"

# device = "cuda:0" if torch.cuda.is_available() else "cpu"
# torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
# model_id = "openai/whisper-large-v3-turbo"
model = whisper.load_model("medium")

# model = AutoModelForSpeechSeq2Seq.from_pretrained(
#     model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
# )
# model.to(device)

# processor = AutoProcessor.from_pretrained(model_id)

# pipe = pipeline(
#     "automatic-speech-recognition",
#     model=model,
#     tokenizer=processor.tokenizer,
#     feature_extractor=processor.feature_extractor,
#     torch_dtype=torch_dtype,
#     device=device,
# )

output_vocal_file = 'converted_audio.wav'

CORS(app)  # Enable CORS

# Ensure folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def convert_audio(input_path, output_path):
    ffmpeg.input(input_path)\
    .output(output_path, ar='16000', ac=1, c='pcm_s16le')\
    .run(overwrite_output=True)

def get_lyrics(input_path):
    try:
        audio = whisper.load_audio(input_path)

        result = whisper.transcribe(model, audio)
        return result
    except Exception as e:
        print("Error during audio processing:", str(e))
        return jsonify({"error": "Audio processing failed", "details": str(e)}), 500
    
# def clean_lyrics(lyrics):
#     prompt = f"Clean the following lyrics:\n\n{lyrics}\n\nCleaned lyrics:"
#     response = openai.responses.create(
#     model="gpt-4o",
#     instructions="You are a music fanatic, clean the lyrics by replacing lines with the correct lines",
#     input=prompt
#     ) 
#     print(response.output[0].content[0].text)
#     return response.output[0].content[0].text


@app.route("/separate", methods=["POST"])
def separate_audio():
    print("Received request to separate audio")
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    print("Saving file to:", filepath)
    file.save(filepath)
    base_url = request.host_url.rstrip('/')

    output_path = os.path.join(OUTPUT_FOLDER, os.path.splitext(filename)[0])

    # Run Spleeter (2 stems: vocals + instrumentals)
    print("Running Spleeter...")
    command = [
        "docker",
        "run",
        "--runtime=nvidia",
        "-v", f"{os.path.abspath(UPLOAD_FOLDER)}:/Downloads",  # Mount the Downloads folder
        "-v", f"{os.path.abspath(OUTPUT_FOLDER)}:/output",  # Mount the output folder
        "deezer/spleeter:3.8",
        "separate",
        "-o", OUTPUT_FOLDER,  # Ensure OUTPUT_FOLDER is defined
        "-p", "spleeter:2stems",
        f"/Downloads/{filename}"  # Use the file inside the mounted /Downloads
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

    vocal_path = os.path.abspath(vocal_path)
    instrumental_path = os.path.abspath(instrumental_path)

    print("Vocal Path:", vocal_path)
    print("Instrumental Path:", instrumental_path)

    convert_audio(vocal_path, f"{output_path}/vocals_converted.wav")
    raw_lyrics = get_lyrics(f"{output_path}/vocals_converted.wav")

    # if isinstance(raw_lyrics, dict) and "text" in raw_lyrics:
    #     lyrics = clean_lyrics(raw_lyrics["text"])
    # else:
    #     lyrics = "Lyrics not found"

    if not os.path.exists(vocal_path) or not os.path.exists(instrumental_path):
        return jsonify({"error": "Separation failed"}), 500
    
    filtered_lyrics_object = [{"start": seg["start"], "end": seg["end"], "text": seg["text"]} for seg in raw_lyrics["segments"]]

    return jsonify({
        "vocals": f"{base_url}/download/{os.path.basename(output_path)}/vocals.wav",
        "instrumental": f"{base_url}/download/{os.path.basename(output_path)}/accompaniment.wav",
        "lyrics": filtered_lyrics_object
    })

@app.route("/download/<path:filename>", methods=["GET"])
def download_file(filename):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)
