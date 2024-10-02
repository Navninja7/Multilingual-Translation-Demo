from flask import Flask, jsonify, request, render_template
from googletrans import Translator
from gtts import gTTS
import os
import numpy as np
from scipy.io.wavfile import write
import soundfile as sf
import simpleaudio as sa

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')  # Serves your HTML page

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.json
        text = data.get('text') 
        target_lang = data.get('target_lang')  # Language code from select element

        
        translator = Translator()
        translated = translator.translate(text, dest=target_lang)

        # Return the translated text and audio path
        return jsonify({"translated_text": translated.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return error details
    

@app.route('/tts', methods=['POST'])
def tts():
    try:
        # Initialize the translator
        data = request.json
        text = data.get('text') 
        target_lang = data.get('target_lang')  # Language code from select element
        translator = Translator()
        translated = translator.translate(text, dest=target_lang)

        # -------------------- Speech Synthesis ---------------------
        audio_path = synthesize_speech(translated.text, target_lang)

        # Play the audio after synthesis
        play_audio(audio_path)

        return jsonify({"translated_text": translated.text, "audio_path": audio_path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Function to synthesize speech using gTTS
def synthesize_speech(text, lang):
    try:
        tts = gTTS(text=text, lang=lang)
        audio_file = 'output.mp3'
        tts.save(audio_file)

        # Convert MP3 to WAV (optional, based on your requirements)
        os.system(f"ffmpeg -i {audio_file} output.wav")  # Ensure ffmpeg is installed

        # Optionally, read the WAV file to ensure it's in the right format
        audio_data, sample_rate = sf.read('output.wav')

        # Save the audio data as a numpy array for further processing if needed
        write('output.wav', sample_rate, (audio_data * 32767).astype(np.int16))

        return 'output.wav'  # Return path to the saved audio file

    except Exception as e:
        print(f"Error in speech synthesis: {str(e)}")
        return None


# Function to play audio
def play_audio(audio_path):
    # Load the audio file
    wave_obj = sa.WaveObject.from_wave_file(audio_path)

    # Play the audio
    play_obj = wave_obj.play()
    play_obj.wait_done()  # Wait until sound has finished playing


if __name__ == "__main__":
    app.run(debug=True)
