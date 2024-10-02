from flask import Flask, jsonify, request, render_template
from googletrans import Translator
from gtts import gTTS
import os
import shutil
import numpy as np
from scipy.io.wavfile import write
import soundfile as sf

app = Flask(__name__)

AUDIO_FOLDER = os.path.join('static','audio')
TEMP_AUDIO_FOLDER = os.path.join('static','temp_audio')
PROFILES = os.path.join('static','profiles')


# Function to clear the audio folder
def clear_audio_folder():
    try:
        if os.path.exists(AUDIO_FOLDER):
            # Remove all files in the folder
            shutil.rmtree(AUDIO_FOLDER)
        # Recreate the folder
        os.makedirs(AUDIO_FOLDER)
        print(f"Cleared and recreated {AUDIO_FOLDER} folder.")
    except Exception as e:
        print(f"Error clearing audio folder: {str(e)}")

def clear_temp_audio_folder():
    try:
        if os.path.exists(TEMP_AUDIO_FOLDER):
            # Remove all files in the folder
            shutil.rmtree(TEMP_AUDIO_FOLDER)
        # Recreate the folder
        os.makedirs(TEMP_AUDIO_FOLDER)
        print(f"Cleared and recreated {TEMP_AUDIO_FOLDER} folder.")
    except Exception as e:
        print(f"Error clearing audio folder: {str(e)}")

@app.route('/')
def index():
    clear_audio_folder()
    clear_temp_audio_folder()
    return render_template('index.html')  # Serves your HTML page

@app.route('/play_custom')
def play_custom():
    return render_template('play_custom.html')

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.json
        text = data.get('text') 
        target_lang = data.get('target_lang')  # Language code from select element
        
        # Initialize the translator
        translator = Translator()
        translated = translator.translate(text, dest=target_lang)

        # Return the translated text
        return jsonify({"translated_text": translated.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return error details
    

@app.route('/tts', methods=['POST'])
def tts():
    try:
        clear_audio_folder()
        data = request.json
        text = data.get('text')
        target_lang = data.get('target_lang')
        file_index = data.get('file_index')
        is_temp = data.get('is_temp')

        if is_temp == 'yes':
            clear_temp_audio_folder()
        else:
            clear_audio_folder()
        
        # Translate the text
        translator = Translator()
        translated = translator.translate(text, dest=target_lang)

        # Synthesize the speech
        audio_path = synthesize_speech(translated.text, target_lang, file_index, is_temp)

        # Return the path to the audio file to be played on the frontend
        return jsonify({
            "translated_text": translated.text, 
            "audio_path": audio_path, 
            "target_lang": target_lang,
            "is_temp": is_temp
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/save_profile',methods=['POST'])
def save_profile():
    try:
        data = request.get_json()
        profile_name = data.get('profile_name'),
        announcement = data.get('announcement'),
        languages = data.get('languages')

        profile_name = profile_name[0]
        announcement = announcement[0]

        # clear_audio_folder()
        
        # Synthesize the speech

        print(languages)
        for lang in languages:
            print('language: ',lang)
            save_speech_profile(profile_name,announcement, lang, 0)

        # Return the path to the audio file to be played on the frontend
        return jsonify({
            # "audio_path": audio_path
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Function to synthesize speech using gTTS
def synthesize_speech(text, lang, file_index,is_temp):
    try:
        # Synthesize speech with gTTS
        tts = gTTS(text=text, lang=lang)
        audio_file_name = ''
        audio_file_mp3 = ''
        if is_temp == 'yes':
            audio_file_name = f'{lang}-audio-temp-{file_index}'
            audio_file_mp3 = os.path.join(TEMP_AUDIO_FOLDER,f'{audio_file_name}.mp3')  # Save to static/temp_audio folder
        else:
            audio_file_name = f'{lang}-audio-{file_index}'
            audio_file_mp3 = os.path.join(AUDIO_FOLDER,f'{audio_file_name}.mp3')  # Save to static/audio folder

        

        tts.save(audio_file_mp3)

        # Optionally convert to WAV (if required)
        if is_temp == 'yes':
            # os.system(f"ffmpeg -i {audio_file_mp3} {TEMP_AUDIO_FOLDER}/{audio_file_name}.wav")  # Ensure ffmpeg is installed
            # # Read the WAV file to confirm format
            # audio_data, sample_rate = sf.read(f'{TEMP_AUDIO_FOLDER}/{audio_file_name}.wav')
            # write(f'{TEMP_AUDIO_FOLDER}/{audio_file_name}.wav', sample_rate, (audio_data * 32767).astype(np.int16))

            # Return the path to the generated audio file
            return f'{TEMP_AUDIO_FOLDER}/{audio_file_name}.mp3'
        else:
            # os.system(f"ffmpeg -i {audio_file_mp3} {AUDIO_FOLDER}/{audio_file_name}.wav")  # Ensure ffmpeg is installed
            # # Read the WAV file to confirm format
            # audio_data, sample_rate = sf.read(f'{AUDIO_FOLDER}/{audio_file_name}.wav')
            # write(f'{AUDIO_FOLDER}/{audio_file_name}.wav', sample_rate, (audio_data * 32767).astype(np.int16))

            print(f'{AUDIO_FOLDER}/{audio_file_name}.mp3')
            # Return the path to the generated audio file
            return f'{AUDIO_FOLDER}/{audio_file_name}.mp3'
        
        
    
    except Exception as e:
        print(f"Error in speech synthesis: {str(e)}")
        return None
    
    # Save custom speech profiles
def save_speech_profile(profile_name, announcement, lang, file_index):
    try:
        # Synthesize speech with gTTS
        tts = gTTS(text=announcement, lang=lang)
        audio_file_name = f'{profile_name}-{lang}-audio-{file_index}'
        print(type(PROFILES))
        print(type(profile_name))
        save_location = os.path.join(PROFILES,profile_name)
        os.makedirs(save_location,exist_ok=True)
        print("save location: ",save_location)
        audio_file_mp3 = os.path.join(save_location,f'{audio_file_name}.mp3')  # Save to static/temp_audio folder

        

        tts.save(audio_file_mp3)

        # Optionally convert to WAV (if required)
        
        # os.system(f"ffmpeg -i {audio_file_mp3} {TEMP_AUDIO_FOLDER}/{audio_file_name}.wav")  # Ensure ffmpeg is installed
        # Read the WAV file to confirm format
        # audio_data, sample_rate = sf.read(f'{TEMP_AUDIO_FOLDER}/{audio_file_name}.wav')
        # write(f'{TEMP_AUDIO_FOLDER}/{audio_file_name}.wav', sample_rate, (audio_data * 32767).astype(np.int16))

        # Return the path to the generated audio file
        # return f'{save_location}/{audio_file_name}.mp3'
        
        
    
    except Exception as e:
        print(f"Error in speech synthesis: {str(e)}")
        return None


if __name__ == "__main__":
    app.run(debug=True)
