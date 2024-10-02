// script.js

// document.getElementById('announce-btn').addEventListener('click', function () {
//     // Simulating a Python backend announcement using fetch or AJAX in real scenarios
//   if(document.getElementById('source-text').value === "")return;
//     const announcementDiv = document.getElementById('announcement');

//     if(announcementDiv.innerHTML === "")return;
    
//     // Simulating the result of a Python backend call to get the announcement
    
  
//     // Update the text content of the announcement
//     announcementDiv.querySelector('p').innerText = "...";
  
//     // Trigger the CSS animation by adding the 'show' class
//     announcementDiv.classList.add('show');
  
//     // Remove the class after a delay (you can adjust this based on your needs)
//     setTimeout(() => {
//       announcementDiv.classList.remove('show');
//     }, 4000); // Hide after 4 seconds
//   });

  // Google Translate Language Codes
  // Source: https://cloud.google.com/translate/docs/languages

  const languages_list = [
    ["Afrikaans", "af"],
    ["Albanian", "sq"],
    ["Arabic", "ar"],
    ["Armenian", "hy"],
    ["Azerbaijani", "az"],
    ["Basque", "eu"],
    ["Belarusian", "be"],
    ["Bengali", "bn"],
    ["Bosnian", "bs"],
    ["Bulgarian", "bg"],
    ["Catalan", "ca"],
    ["Cebuano", "ceb"],
    ["Chinese (Simplified)", "zh-CN"],
    ["Chinese (Traditional)", "zh-TW"],
    ["Croatian", "hr"],
    ["Czech", "cs"],
    ["Danish", "da"],
    ["Dutch", "nl"],
    ["English", "en"],
    ["Esperanto", "eo"],
    ["Estonian", "et"],
    ["Finnish", "fi"],
    ["French", "fr"],
    ["Galician", "gl"],
    ["Georgian", "ka"],
    ["German", "de"],
    ["Greek", "el"],
    ["Gujarati", "gu"],
    ["Haitian Creole", "ht"],
    ["Hebrew", "iw"],
    ["Hindi", "hi"],
    ["Hmong", "hmn"],
    ["Hungarian", "hu"],
    ["Icelandic", "is"],
    ["Igbo", "ig"],
    ["Indonesian", "id"],
    ["Irish", "ga"],
    ["Italian", "it"],
    ["Japanese", "ja"],
    ["Javanese", "jw"],
    ["Kannada", "kn"],
    ["Kazakh", "kk"],
    ["Khmer", "km"],
    ["Korean", "ko"],
    ["Kurdish (Kurmanji)", "ku"],
    ["Kyrgyz", "ky"],
    ["Lao", "lo"],
    ["Latvian", "lv"],
    ["Lithuanian", "lt"],
    ["Luxembourgish", "lb"],
    ["Macedonian", "mk"],
    ["Malagasy", "mg"],
    ["Malay", "ms"],
    ["Malayalam", "ml"],
    ["Maltese", "mt"],
    ["Maori", "mi"],
    ["Marathi", "mr"],
    ["Mongolian", "mn"],
    ["Myanmar (Burmese)", "my"],
    ["Nepali", "ne"],
    ["Norwegian", "no"],
    ["Pashto", "ps"],
    ["Persian", "fa"],
    ["Polish", "pl"],
    ["Portuguese", "pt"],
    ["Punjabi", "pa"],
    ["Romanian", "ro"],
    ["Russian", "ru"],
    ["Serbian", "sr"],
    ["Sesotho", "st"],
    ["Shona", "sn"],
    ["Sindhi", "sd"],
    ["Sinhala", "si"],
    ["Slovak", "sk"],
    ["Slovenian", "sl"],
    ["Somali", "so"],
    ["Spanish", "es"],
    ["Sundanese", "su"],
    ["Swahili", "sw"],
    ["Swedish", "sv"],
    ["Tamil", "ta"],
    ["Telugu", "te"],
    ["Thai", "th"],
    ["Turkish", "tr"],
    ["Ukrainian", "uk"],
    ["Urdu", "ur"],
    ["Uzbek", "uz"],
    ["Vietnamese", "vi"],
    ["Welsh", "cy"],
    ["Xhosa", "xh"],
    ["Yiddish", "yi"],
    ["Yoruba", "yo"],
    ["Zulu", "zu"],
];

// console.log(languages);
document.getElementById('languages').insertAdjacentHTML('beforeend', languages_list.map(([name, code]) => `<option value="${code}">${name}</option>`));


let select = document.getElementById("languages");
let announcementText = document.getElementById('source-text');
let translationOutput = document.getElementById('translation-output');
// interval reference for highlighting text
let interval;
let temp_intr;
let currentText;
let currentAudio;
let currentAudioDuration = 10000;
let currentTempAudio;
let stopAudio = false;
let isAnnounced = true;

let file_index = 0;
let temp_file_index = 0;

function animateText(translated_text,audioID){
  // if(currentAudio !== undefined){
  //   console.log(currentAudio);
  //   currentAudio.currentTime = 0;
  //   currentAudio.pause();
  // }
  clearInterval(interval);
  let outputText = document.getElementsByClassName('output-text');
  let words = translated_text.split(" ");
  let word_index = 0;
  let word_length = 0;
  let duration;

  currentAudio.play();

  document.querySelectorAll('.output-text').forEach((element)=>{
    element.classList = "output-text";
  })
  duration = document.getElementById(audioID).duration;
  for(let i=0;i<words.length;i++){
    word_length += words[i].length;
  }

  let timeout = parseInt((parseFloat(words[0].length) / parseFloat(word_length)) * duration * 1000);
  let randomOffset = Math.random()*180 + (-150);
  let intr_timeout = (timeout + randomOffset < 0)?timeout: (timeout + randomOffset);
  interval = setInterval(() => {
  let x = words[word_index];
  timeout = parseInt((parseFloat(x.length) / parseFloat(word_length)) * duration * 1000);
  
  outputText[word_index].classList.add('highlight');
  setTimeout(() => {
    outputText[word_index].classList.replace('highlight','after-highlight');
    word_index++;
    if(word_index == words.length){
        clearInterval(interval);
      }
    }, intr_timeout-20);
    
  }, intr_timeout);
}
//   Connected backend to frontend via fetch

document.getElementById('announce-btn').addEventListener('click', function () {
  console.log(announcementText.value);
  if(announcementText.value === "")return;
  clearInterval(interval);
    const announcementDiv = document.getElementById('announcement');
    translationOutput.innerHTML = "...";
  
    // Simulate translation API call
    fetch('/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: announcementText.value,
        target_lang: select.value
      })
    })
    .then(response => response.json())
    .then(data => {
      // Update the text content with the translated text
      currentText = data.translated_text;
      announcementDiv.querySelector('p').innerText = "";
      let translated_text_array = data.translated_text.split(' ');
      
      for(let i=0;i<translated_text_array.length;i++){
        announcementDiv.querySelector('p').insertAdjacentHTML('beforeend',`
          <span class='output-text'>${translated_text_array[i]} </span>
          `);  
      }
  
      // Trigger the CSS animation by adding the `'show' class
      announcementDiv.classList.add('show');
  
      setTimeout(() => {
        announcementDiv.classList.remove('show');
      }, 4000);
    })
    .catch(error => console.error('Error:', error));

    fetch('/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: announcementText.value,
        target_lang: select.value,
        file_index: file_index,
        is_temp: 'no'
      })
    })
    .then(response => response.json())
    .then(data => {

      console.log('new blake');
        
        let newAudio = document.createElement('audio');
        let audioID = `${data.target_lang}-audio-${file_index++}`;
        newAudio.setAttribute('id', audioID);
        let newSource = document.createElement('source');
        console.log(data.audio_path);
        newSource.setAttribute('src', data.audio_path);
        newSource.setAttribute('type','audio/mpeg');
        
        newAudio.appendChild(newSource);
        document.getElementById('audio-files').appendChild(newAudio);

        
        //Highlighting parts of the text that are being spoken
        
        

          currentAudio = newAudio;
          currentAudioDuration = currentAudio.duration;
          console.log("audio length: (tts): ", currentAudio.duration);
          isAnnounced = false;
          setTimeout(() => {
            isAnnounced = true;
          }, currentAudio.duration + 500);
          animateText(data.translated_text,audioID);
        

        
        
        
    })
    .catch(error => console.error('Error:', error));
  });

  document.getElementById('listen').addEventListener('click',()=>{
    console.log("listen");
    animateText(currentText,currentAudio.id);
  });

  //Create custom announcements Modal
  
let customAnnouncementsModal = document.getElementById('custom-announcement-modal');
  document.getElementById('custom-announcements').addEventListener('click',()=>{
    document.querySelectorAll('.custom-profile').forEach((profile)=>{
      profile.style.backgroundColor="";
    })
    if(localStorage.length > 1){
   
      document.getElementById('no-custom-announcements').style.display="none";
      document.getElementById('show-custom-announcements').style.display="flex";
      if(document.getElementById('custom-announcements-pane').classList.contains('justify-center')){
        document.getElementById('custom-announcements-pane').classList.remove('justify-center','align-center');
      }
  
  } else {
    document.getElementById('no-custom-announcements').style.display="flex";
        document.getElementById('show-custom-announcements').style.display="none";
  
  }
    
      customAnnouncementsModal.showModal();
      customAnnouncementsModal.classList.replace('hide','show');

  });

  document.getElementById('create-custom-announcement').addEventListener('click',()=>{
    document.querySelectorAll('.custom-profile').forEach((profile)=>{
      profile.style.backgroundColor="";
    })
    document.getElementById('create-custom-announcements-form').classList.replace('hide','show');
    document.getElementById('announcement-name').value = "";
    document.getElementById('select-chime').value = "chime_1";
    document.getElementById('custom-announcement-input').value = "";

    document.querySelectorAll('.select-languages-option').forEach((option)=>{
          if(option.id === 'en')return;
          option.checked = false;
          option.setAttribute('selected','false');
      });

      

      document.getElementById('save-languages').click();
      document.getElementById('announce-hrs').value = "00";
      document.getElementById('announce-mins').value = "00";
      document.getElementById('announce-secs').value = "00";
  })

  document.getElementById('close-modal-btn').addEventListener('click',()=>{
    if(document.getElementById('create-custom-announcements-form').classList.contains('show')){
      //display confirmation modal

      document.getElementById('create-custom-announcements-form').classList.replace('show','hide');
    }
    customAnnouncementsModal.close();
    customAnnouncementsModal.classList.replace('show','hide');
  }
);

// Add Languages modal
let addLanguagesModal = document.getElementById('add-languages-modal');
  document.getElementById('add-language').addEventListener('click',()=>{
      addLanguagesModal.showModal();
      addLanguagesModal.classList.replace('hide','show');
});

document.getElementById('select-languages-container').insertAdjacentHTML('beforeend', languages_list .map(([name, code]) => `
<div id="div-${code}" name="${name}" class='select-language'>
<input id="${code}" name="${name}" class='select-languages-option' selected="false" type='checkbox' />
<label for="${code}">${name}</label>
</div>`).join(''));

document.getElementById('en').checked = true;
document.getElementById('en').disabled = true;

document.getElementById('search-languages').addEventListener('keydown',()=>{
  setTimeout(() => {
    
  
  document.querySelectorAll('.select-language').forEach((item)=>{
    if(!item.getAttribute('name').toLowerCase().includes(document.getElementById('search-languages').value.toLowerCase())){
      
        
        item.style.height=0;
        item.style.opacity=0;
        item.style.transition = "all 0.1s";
        item.style.border="none";
        item.style.padding="0";
        setTimeout(() => {
          // item.style.display="none";
        }, 300);
      
    } else {
        item.style.height="auto";
        item.style.opacity=1;
        item.style.transition = "all 0.1s";
        item.style.borderBottom="1px solid #777";
        item.style.padding="10px";
      
    }
  })
}, 1);
})

document.querySelectorAll('.select-languages-option').forEach((option)=>{
  option.addEventListener('click',()=>{
    if(option.checked){
      option.setAttribute('selected','true');
    }
    else{
      option.setAttribute('selected','false');
  }
});
});

document.getElementById('save-languages').addEventListener('click',()=>{
  document.getElementById('audio-preview-container').innerHTML = "";
  document.querySelectorAll('.select-languages-option').forEach((option)=>{

    if(option.checked){
      let audioPreview = document.createElement('div');
      // audioPreview.id = `${option.id}-play-preview`;
      audioPreview.classList.add('audio-preview');
      let optionId = document.createElement('i');
      optionId.id = `${option.id}-play-preview`;
      optionId.setAttribute('lang-code',`${option.id}`);
      optionId.classList = "play-preview fa fa-play";
      optionId.setAttribute('aria-hidden','true');
      let optionText = document.createElement('p');
      optionText.innerText = `${option.getAttribute("name")}`;
      audioPreview.appendChild(optionId);
      audioPreview.appendChild(optionText);

      let textPreview = document.createElement('div');
      textPreview.id = `${option.id}-text-preview`;
      textPreview.classList.add('text-preview');
      textPreview.setAttribute('lang-code',`${option.id}`);
      textPreview.setAttribute('name',`${option.getAttribute('name')}`);
      // textPreview.style.backgroundImage = "repeating-linear-gradient(45deg,#234 1%, #ccc 4%)";
      textPreview.style.backgroundSize = "300%";
      
      let test = 0;
      // setInterval(() => {
      //   textPreview.style.backgroundPosition = `${test}px`;
      //   test+=20;
      // }, 20);
      let previewText = document.createElement('p');
      previewText.id = `${option.id}-text`;
      previewText.innerText = "Loading...";
      textPreview.appendChild(previewText);
      document.getElementById('audio-preview-container').appendChild(audioPreview);
      document.getElementById('audio-preview-container').appendChild(textPreview);
      // document.getElementById('audio-preview-container').insertAdjacentHTML('beforeend',`
      //   <div class='audio-preview'>
      //   <i id='${option.id}-play-preview' class="play-preview fa fa-play" aria-hidden="true"></i><p>${option.getAttribute("name")}</p>
      //   </div>
      //   <div id='${option.id}' name='${option.getAttribute('name')}' class='text-preview'>
      //   <p id='${option.id}-text'></p>
      //   </div>
      //   `);
        }
    });
    setTimeout(() => {
      
      generateTextTranslations();
      generateAudioTranslations();
    }, 1);

  });

  // Load english language as default
  document.getElementById('save-languages').click();

  function generateTextTranslations(){
    // temp_file_index--;
    if(document.getElementById('custom-announcement-input').value === "")return;
    document.querySelectorAll('.text-preview').forEach((preview)=>{

      //Simulate API Call to get the translated text
    fetch('/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: document.getElementById('custom-announcement-input').value,
        target_lang: preview.getAttribute('lang-code')
      })
      
    })
    .then(response =>response.json())
    .then(data => {
      // Update the text content with the translated text
      
      document.getElementById(`${preview.getAttribute('lang-code')}-text`).innerHTML = data.translated_text;
      
    })
    .catch(error => console.error('Error:', error));
  });
  
  }

  function generateAudioTranslations(){
    if(document.getElementById('custom-announcement-input').value === "")return;
    document.getElementById('temp_audio_files').innerHTML = "";
    document.querySelectorAll('.play-preview').forEach((playBtn)=>{

      
      fetch('/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: document.getElementById('custom-announcement-input').value,
          target_lang: playBtn.getAttribute('lang-code'),
          file_index: temp_file_index,
          is_temp: 'yes'
        })
      })
      .then(response => response.json())
      .then(data => {
        
        
          let newAudio = document.createElement('audio');
          let audioID = `${data.target_lang}-audio-temp-${temp_file_index}`;
          newAudio.setAttribute('id', audioID);

          let newSource = document.createElement('source');
          console.log(data.audio_path);
          console.log('audio ID: ', audioID);
          newSource.setAttribute('src', data.audio_path);
          newSource.setAttribute('type','audio/mpeg');
          newAudio.appendChild(newSource);
          document.getElementById('temp_audio_files').appendChild(newAudio);
          playBtn.setAttribute('source', audioID);
          
            
              playBtn.addEventListener('click',()=>{
                if(currentTempAudio !== undefined){
                  console.log(currentTempAudio);
                  currentTempAudio.currentTime = 0;
                  currentTempAudio.pause();
                }
                currentTempAudio = newAudio;
                currentTempAudio.play();
          });
              
  
      })
      .catch(error => console.error('Error:', error));

    });

  }

  function generateAudioProfilesForCustomLoad(announcement,languages,languageIndex){

    //base condition
    if(languageIndex === languages.length){

      //stop and translation sound and text
      
    if(currentTempAudio !== undefined){
      currentTempAudio.currentTime = 0;
      currentTempAudio.pause();
      currentTempAudio = null;
      console.log('stop 2');
    }
    
    clearInterval(temp_intr);
    document.getElementById('announcement-info-time').style.backgroundImage = "";
    document.getElementById('announcement-info-time-text').innerHTML = "...";
    document.getElementById('announcement-info-text').innerHTML = "...";


      //Enable play button when announcements stop
    document.getElementById("play-custom-announcements").style.backgroundColor = "";
    document.getElementById("play-custom-announcements").removeAttribute('disabled');

      
      stopAudio = false;
      let translateInput = document.getElementById('translate-input');
  translateInput.style.opacity = 1;
  translateInput.style.transform = "translateY(0)";
  let announcementBox = document.getElementById('announcement');
  announcementBox.style.transform = "translateY(0)";
  announcementBox.style.height = "auto";
  document.getElementById('source-text').value ="";
  document.getElementById('translation-output').innerHTML = "Announcment will appear here";
  document.getElementById('listen').style.transform = "translateY(0)";
  document.getElementById('listen').style.opacity = 1;

  //announcement info box

  document.getElementById('announcement-info-container').style.opacity=0;
  document.getElementById('announcement-info-container').style.transform="translateY(0)";
  document.getElementById('translation-output').style.color = "";

  setTimeout(() => {
    let newEvent = new KeyboardEvent('keydown',{
      key: 'r',
      code: 'KeyR',
      keyCode: 82,
      ctrlKey: true,
      bubbles: true
    });
  document.dispatchEvent(newEvent);
    return;
  }, 600);
    }

    //recursive code
    
    document.getElementById('source-text').value = announcement;
    document.getElementById('languages').value = languages[languageIndex];

    

    for(let x of languages_list){
      if(x[1] === languages[languageIndex]){
        document.getElementById('announcement-info-text').innerHTML = `${x[0]} (${languages[languageIndex]})`;
      }
    }
    
    
      
      fetch('/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: announcement,
          target_lang: languages[languageIndex],
          file_index: temp_file_index,
          is_temp: 'yes'
        })
      })
      .then(response => response.json())
      .then(data => {
        if(stopAudio){
          console.log('stop 3');
          currentTempAudio.currentTime = 0;
          currentTempAudio.pause();
          currentTempAudio = null;
          return;
        }


        
        
          let newAudio = document.createElement('audio');
          let audioID = `${data.target_lang}-audio-temp-${temp_file_index}`;
          newAudio.setAttribute('id', audioID);

          let newSource = document.createElement('source');
          console.log(data.audio_path);
          console.log('audio ID: ', audioID);
          newSource.setAttribute('src', data.audio_path);
          newSource.setAttribute('type','audio/mpeg');
          newAudio.appendChild(newSource);
          document.getElementById('temp_audio_files').appendChild(newAudio);
          
              currentTempAudio = newAudio;
              if(stopAudio){
                currentTempAudio.currentTime = 0;
                currentTempAudio.pause();
                console.log('stop 4');
                return;
              }
              currentTempAudio.play();

              // let checkAudio = setInterval(() => {
                
              //   if(stopAudio){
              //     console.log('abrupt stop');
              //     if(currentTempAudio !== undefined){
              //       currentTempAudio.currentTime = 0;
              //       currentTempAudio.pause();
              //     }
              //     languageIndex = languages.length;
              //     document.getElementById('translation-output').innerHTML = "Announcement will appear here";
              //     document.getElementById('translation-output').style.color = "";
              //     clearInterval(checkAudio);
              //     generateAudioProfilesForCustomLoad(announcement,languages,languageIndex);
              //   }
              // }, 1);

             

              

              currentTempAudio.addEventListener('canplaythrough',()=>{
                let offset = 0;
                let duration = currentTempAudio.duration;
                let remainingDuration = duration+1;
                let elapsedTime = 0;
                let effectTime = 10;
                document.getElementById('announcement-info-time-text').innerHTML = `(${Math.floor(remainingDuration)} <span class='light'> Seconds</span>)`
                setTimeout(() => {
                  temp_intr = setInterval(() => {
                    remainingDuration-=0.01;
                    const firstColorPercentage = (parseFloat(elapsedTime) / parseFloat(duration)) * 100;
                    // const secondColorPercentage = (parseFloat(duration - elapsedTime) / parseFloat(duration)) * 100;
                    document.getElementById('announcement-info-time-text').innerHTML = `(${Math.floor(remainingDuration)} <span class='light'> Seconds</span>)`
                    document.getElementById('announcement-info-time').style.backgroundImage = `linear-gradient(to right,#456, #456 ${firstColorPercentage}%,#234 ${firstColorPercentage}%, #234)`;
                    elapsedTime += parseFloat(effectTime/1000);
                  }, effectTime);
                }, 10);
                
                
                // let duration_effect = setInterval(() => {
                //   document.getElementById('announcement-info-time').style.background = `linear-gradient(to right,${(parseFloat(elapsed_time)/parseFloat(duration)) * 100}% red, ${(parseFloat(remainingDuration - elapsedTime)/parseFloat(duration)) * 100}% blue)`;
                //   elapsedTime += effect_time;
                // },effect_time);
                  
              })

              document.getElementById('announcement').querySelector('p').innerText = "";

              if(data.translated_text !== undefined){
                document.getElementById('translation-output').innerHTML = data.translated_text;
              } else {
                document.getElementById('translation-output').querySelector('p').innerHTML = "...";
              }
              document.getElementById('translation-output').style.color = "#f4f4f4";

              //stop text and audio when stop button is clicked
              
              

          currentTempAudio.addEventListener('ended',()=>{
            clearInterval(temp_intr);

            languageIndex++;
              generateAudioProfilesForCustomLoad(announcement,languages,languageIndex);
          });
              
  
      })
      .catch(error => console.error('Error:', error));

  }

  

  



  document.getElementById('custom-announcement-input').addEventListener('change',()=>{
    // document.querySelectorAll('.text-preview').forEach((preview)=>{
    // })
      generateTextTranslations();
      generateAudioTranslations();
      
  });

  document.getElementById('custom-announcement-input').addEventListener('keydown',(e)=>{
    document.querySelectorAll('.text-preview').forEach((preview)=>{
      document.getElementById(`${preview.getAttribute('lang-code')}-text`).innerHTML = "Loading...";
    })
    if(e.key === "Enter"){
        generateTextTranslations();
        generateAudioTranslations();
    }
  })


document.getElementById('close-add-languages-btn').addEventListener('click',()=>{
  addLanguagesModal.close();
      addLanguagesModal.classList.replace('show','hide');
});

document.getElementById('listen-chime').addEventListener('click',()=>{
  let chimeID = document.getElementById('select-chime').value;
  console.log(document.getElementById(chimeID));
  document.getElementById(chimeID).play();
});

// Saving custom profiles

function addCustomProfile({profile_name,announcement,chime,languages,announcement_time}){

  let custom_profile = document.createElement('div');
      custom_profile.setAttribute('id',profile_name);
      custom_profile.setAttribute('chime',chime);
      custom_profile.setAttribute('announcement',announcement);
      custom_profile.setAttribute('languages',languages);
      custom_profile.setAttribute('announcement-time',announcement_time);
      custom_profile.classList.add('custom-profile');
      custom_profile.addEventListener('click',()=>{
        console.log('custom profile clicked!');
        displayProfileData(profile_name);
      });
      custom_profile.insertAdjacentHTML('beforeend',`<p>${profile_name}</p>`);
      let trash = document.createElement('i');
      trash.setAttribute('id',`delete-${profile_name}`);
      trash.classList.add('fa-solid','fa-trash');
      custom_profile.appendChild(trash);
      document.getElementById('show-custom-announcements').appendChild(custom_profile);
      trash.addEventListener('click',()=>{
        console.log('delete: ' + trash.id);
        for(let i=0;i<localStorage.length;i++){
          if(localStorage.key(i).includes(profile_name)){
            localStorage.removeItem(localStorage.key(i));
            i--;
          }
        }
        let profilesArr = JSON.parse(localStorage.getItem('profiles'));
        profilesArr = profilesArr.filter((profile)=>profile !== profile_name);
        localStorage.setItem('profiles',JSON.stringify(profilesArr));
        document.getElementById('create-custom-announcements-form').classList.replace('show','hide');
        custom_profile.remove();
      })
  // document.getElementById('show-custom-announcements').insertAdjacentHTML('beforeend',`
  //   <div id='${profile_name}' chime='${chime}' announcement='${announcement}' languages='${JSON.parse(languages).join(',')}' announcement-time='${JSON.parse(announcement_time).join(',')}' class='custom-profile'>
  //   <p>${profile_name}</p><i class="fa-solid fa-greater-than"></i>
  //   </div>
  //   `);
  // document.getElementById('custom-announcements-pane')

}

function generateCustomProfiles(){
  let profiles = JSON.parse(localStorage.getItem('profiles'));
  for(let i=0;i<profiles.length;i++){
    let profile_name = profiles[i];
    let chime;
    let announcement;
    let languages;
    let announcement_time;
    for(let j=0;j<localStorage.length;j++){
      
      if(localStorage.key(j) === `${profile_name}_chime`){
        chime = localStorage.getItem(`${profile_name}_chime`);
        
      }
      if(localStorage.key(j) === `${profile_name}_announcement`){
        announcement = localStorage.getItem(`${profile_name}_announcement`);
        
      }
      if(localStorage.key(j) === `${profile_name}_languages`){
        languages = localStorage.getItem(`${profile_name}_languages`);
        
      }
      if(localStorage.key(j) === `${profile_name}_announcement_time`){
        announcement_time = localStorage.getItem(`${profile_name}_announcement_time`);
        
      }
      }
      let custom_profile = document.createElement('div');
      custom_profile.setAttribute('id',profile_name);
      custom_profile.setAttribute('chime',chime);
      custom_profile.setAttribute('announcement',announcement);
      custom_profile.setAttribute('languages',languages);
      custom_profile.setAttribute('announcement-time',announcement_time);
      custom_profile.classList.add('custom-profile');
      custom_profile.addEventListener('click',()=>{
        console.log('custom profile clicked!');
        displayProfileData(profile_name);
      });
      let trash = document.createElement('i');
      trash.setAttribute('id',`delete-${profile_name}`);
      trash.classList.add('fa-solid','fa-trash');
      custom_profile.insertAdjacentHTML('beforeend',`<p>${profile_name}</p>`);
      custom_profile.appendChild(trash);
      document.getElementById('show-custom-announcements').appendChild(custom_profile);

      trash.addEventListener('click',()=>{
        document.getElementById('paper-crush').play();
        console.log('delete: ' + trash.id);
        for(let i=0;i<localStorage.length;i++){
          if(localStorage.key(i).includes(profile_name)){
            localStorage.removeItem(localStorage.key(i));
            i--;
          }
        }
        let profilesArr = JSON.parse(localStorage.getItem('profiles'));
        profilesArr = profilesArr.filter((profile)=>profile !== profile_name);
        localStorage.setItem('profiles',JSON.stringify(profilesArr));
        document.getElementById('create-custom-announcements-form').classList.replace('show','hide');
        setTimeout(() => {
          
          custom_profile.remove();
        }, 1);
      })

      // document.getElementById('show-custom-announcements').insertAdjacentHTML('beforeend',`
      //   <div id='${profile_name}' chime='${chime}' announcement='${announcement}' languages='${JSON.parse(languages).join(',')}' announcement-time='${JSON.parse(announcement_time).join(',')}' class='custom-profile'>
      //   <p>${profile_name}</p><i id='delete-${profile_name}' class="fa-solid fa-trash"></i>
      //   </div>
      //   `);
  }
}




function displayProfileData(profile_name){
  let custom_profile = document.getElementById(profile_name);
  document.querySelectorAll('.custom-profile').forEach((profile)=>{
    profile.style.backgroundColor="";
  });
  custom_profile.style.backgroundColor="#388";
  document.getElementById('create-custom-announcements-form').classList.replace('hide','show');
  document.getElementById('announcement-name').value = profile_name;
  document.getElementById('select-chime').value = custom_profile.getAttribute('chime');
  document.getElementById('custom-announcement-input').value = custom_profile.getAttribute('announcement');
  let languages = JSON.parse(custom_profile.getAttribute('languages'));
  let langIndex = 0;
  console.log('languages: ', languages);

  document.querySelectorAll('.text-preview').forEach(textPreview => {
    textPreview.querySelector('p').innerHTML = "Loading...";
  });
  
  document.querySelectorAll('.select-languages-option').forEach((option)=>{
    if(option.id === 'en')return;
    option.checked = false;
    option.setAttribute('selected','false');
    for(let i=0;i<languages.length;i++){
      if(option.id === languages[i]){
        option.checked = true;
        option.setAttribute('selected','true');
      }
    }
    console.log(option.id, option.checked);
  });
  document.getElementById('save-languages').click();
  let announcementTime = JSON.parse(custom_profile.getAttribute('announcement-time'));
    document.getElementById('announce-hrs').value = announcementTime[0];  
    document.getElementById('announce-mins').value = announcementTime[1];
    document.getElementById('announce-secs').value = announcementTime[2];

}

//Generate custom profiles on page load
if(localStorage.length > 1){
   
    document.getElementById('no-custom-announcements').style.display="none";
    document.getElementById('show-custom-announcements').style.display="flex";
    if(document.getElementById('custom-announcements-pane').classList.contains('justify-center')){
      document.getElementById('custom-announcements-pane').classList.remove('justify-center','align-center');
    }
    generateCustomProfiles();

} else {
  document.getElementById('no-custom-announcements').style.display="flex";
      document.getElementById('show-custom-announcements').style.display="none";

}

document.getElementById('save-profile').addEventListener('click',()=>{

  // check if profile name already exists
  for(let i=0;i<localStorage.length;i++){
    if(localStorage.key(i).includes(document.getElementById('announcement-name').value)){
      // alert("Profile name already exists!");
      let alertBox = document.getElementById('alert-box');
      document.getElementById('alert-message').innerHTML = "Profile name already exists!";
      alertBox.style.transform = "translateY(-45px)";
      alertBox.style.transition = "all 0.5s ease-out";
      setTimeout(() => {
        alertBox.style.transform = "translateY(0)";
      }, 2000);

      return;
    }
  }
  
  let profile_name = document.getElementById('announcement-name').value;
  let announcement = document.getElementById('custom-announcement-input').value;
  let languagesArr = [];
  let announcementTime = [document.getElementById('announce-hrs').value,document.getElementById('announce-mins').value,document.getElementById('announce-secs').value];
  document.querySelectorAll('.text-preview').forEach((preview)=>{
    languagesArr.push(preview.getAttribute('lang-code'));
  });

  let payload = {
    profile_name: profile_name,
    announcement: announcement,
    languages: languagesArr
  }
  
  fetch('/save_profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)

  
  })
  .then(response => response.json())
  .then(data => {
    // Update the text content with the translated text
    // localStorage.setItem(`${profile_name}-chime`,document.getElementById('select-chime').value);
    
  })
  .catch(error => console.error('Error:', error));

  let custom_profile = {
    profile_name: profile_name,
    announcement: announcement,
    chime: document.getElementById('select-chime').value,
    languages: JSON.stringify(languagesArr),
    announcement_time: JSON.stringify(announcementTime)
  }
  if(localStorage.getItem('profiles') === null){
    localStorage.setItem('profiles',JSON.stringify([profile_name]));
  } else {
    let profilesArr = JSON.parse(localStorage.getItem('profiles'));
    profilesArr.push(profile_name);
    localStorage.setItem('profiles',JSON.stringify(profilesArr));
  }

  localStorage.setItem(`${profile_name}_chime`,document.getElementById('select-chime').value);
  localStorage.setItem(`${profile_name}_announcement`,custom_profile.announcement);
  localStorage.setItem(`${profile_name}_languages`,custom_profile.languages);
  localStorage.setItem(`${profile_name}_announcement_time`,custom_profile.announcement_time);
  addCustomProfile(custom_profile);

  if(document.getElementById('no-custom-announcements').style.display === "flex"){
    document.getElementById('no-custom-announcements').style.display="none";
    document.getElementById('show-custom-announcements').style.display="flex";
    document.getElementById('custom-announcements-pane').classList.remove('justify-center','align-center');
  }
  console.log("profile saved");
});


// Playing custom profiles

function generatePlayProfiles(){
  document.getElementById('play-profiles-container').innerHTML="";
  document.querySelectorAll('.custom-profile').forEach((profile)=>{
    let playProfile = document.createElement('div');
    playProfile.classList.add('play-profile');
    playProfile.setAttribute('id',profile.id);
    playProfile.setAttribute('chime',profile.getAttribute('chime'));
    playProfile.setAttribute('announcement',profile.getAttribute('announcement'));
    playProfile.setAttribute('languages',profile.getAttribute('languages'));
    playProfile.setAttribute('announcement-time',profile.getAttribute('announcement-time'));
    document.getElementById('play-profiles-container').appendChild(playProfile);
    playProfile.addEventListener('click',()=>{
      console.log('play profile clicked!');
      loadCustomProfile(playProfile);
    })
    playProfile.innerHTML = `
    <div>Profile: <span class='light'>${profile.id}</span></div>
    <div>Announcement: <span class='light'>${profile.getAttribute('announcement')}</span></div>
    `
  })
}

function loadCustomProfile(playProfile){
  stopAudio = false;

  //Disable play button while announcements play
  document.getElementById("play-custom-announcements").style.backgroundColor = "#0056b3";
    document.getElementById("play-custom-announcements").setAttribute('disabled','');

  let translateInput = document.getElementById('translate-input');
  translateInput.style.transition = "all 0.3s ease-out";
  translateInput.style.opacity = 0;
  translateInput.style.transform = "translateY(-50px)";
  let announcementBox = document.getElementById('announcement');
  announcementBox.style.transition="all 1s ease-out";
  announcementBox.style.transform = "translateY(-150px)";
  announcementBox.style.height = "200px";
  announcementBox.querySelector('p').innerHTML = "...";
  document.getElementById('listen').style.transition = "all 0.3s ease-out";
  document.getElementById('listen').style.transform = "translateY(50px)";
  document.getElementById('listen').style.opacity = 0;
  document.getElementById('close-play-modal-btn').click();

  //announcment info box
  document.getElementById('announcement-info-container').style.transform = "translateY(-150px)";
  document.getElementById('announcement-info-container').style.opacity=1;
  setTimeout(() => {
    document.getElementById('announcement-info-container').classList.replace('hide','show');
  }, 2000);

  let announcement = playProfile.getAttribute('announcement');
  let languages = JSON.parse(playProfile.getAttribute('languages'));
  let languageIndex = 0;

  // Stop announcements
  document.getElementById('stop-announcements').addEventListener('click',()=>{

    stopAudio = true;

    let chime = document.getElementById(`${playProfile.getAttribute('chime')}`);
    if(chime !== undefined){
      chime.currentTime = 0;
      chime.pause();
      chime = null;
    }

    //stop and translation sound and text
      
    if(currentTempAudio !== undefined){
      currentTempAudio.currentTime = 0;
      currentTempAudio.pause();
      currentTempAudio = null;

      console.log('stop 1');
    }
    console.log('stop 0');
    
    clearInterval(temp_intr);
    document.getElementById('announcement-info-time').style.backgroundImage = "";
    document.getElementById('announcement-info-time-text').innerHTML = "...";
    document.getElementById('announcement-info-text').innerHTML = "...";


      //Enable play button when announcements stop
    document.getElementById("play-custom-announcements").style.backgroundColor = "";
    document.getElementById("play-custom-announcements").removeAttribute('disabled');

    let translateInput = document.getElementById('translate-input');
  translateInput.style.opacity = 1;
  translateInput.style.transform = "translateY(0)";
  let announcementBox = document.getElementById('announcement');
  announcementBox.style.transform = "translateY(0)";
  announcementBox.style.height = "auto";
  document.getElementById('source-text').value ="";
  document.getElementById('translation-output').innerHTML = "Announcment will appear here";
  document.getElementById('listen').style.transform = "translateY(0)";
  document.getElementById('listen').style.opacity = 1;

  //announcement info box

  document.getElementById('announcement-info-container').style.opacity=0;
  document.getElementById('announcement-info-container').style.transform="translateY(0)";
  document.getElementById('translation-output').style.color = "";



    
    



    

    // languageIndex = languages.length;
    // generateAudioProfilesForCustomLoad(announcement,languages,languageIndex);
  })



  
    if(playProfile.getAttribute('chime') !== "None"){
      document.getElementById(`${playProfile.getAttribute('chime')}`).play();
      document.getElementById(`${playProfile.getAttribute('chime')}`).addEventListener('ended',()=>{
        document.getElementById('source-text').value = announcement;
        console.log("language code: ", languages[languageIndex]); 
        document.getElementById('languages').value = languages[languageIndex++];
          generateAudioProfilesForCustomLoad(announcement,languages,languageIndex);    
      })
    }

}

// Display play custom profiles modal
document.getElementById('play-custom-announcements').addEventListener('click',()=>{
  


  document.getElementById('play-custom-modal').classList.replace('hide','show');
  generatePlayProfiles();
});

document.getElementById('close-play-modal-btn').addEventListener('click',()=>{
  document.getElementById('play-custom-modal').classList.replace('show','hide');
})







/* Clock scripts */

// Clock marks generator
function generateClockMarks(){

  let b=0;
  let a = 30;
  for(let i=0;i<11;i++){
      let lines = document.getElementsByClassName("mark")[0];
      let clone = lines.cloneNode(true);
      document.getElementById('clock').appendChild(clone);
document.getElementById("clock").lastChild.style.transform="rotate("+a+"deg)";
      a+=30;
      b++;
      }
}

generateClockMarks();

// Clock hands movement
let x = y = z = -90;
let hour = document.getElementsByClassName("hrhand")[0];
let min = document.getElementsByClassName("minhand")[0];
let second = document.getElementById("second");

  // Current time
let date = new Date();
let hours = date.getHours();
let minutes = date.getMinutes();
let seconds = date.getSeconds(); 
if(hours<12){
  document.getElementById('am-pm').innerHTML = "AM";
} else {
  document.getElementById('am-pm').innerHTML = "PM";
}

setInterval(()=>{
  hour.style.transform = "rotate("+x+"deg)";
  min.style.transform = "rotate("+y+"deg)";
  second.style.transform = "rotate("+z+"deg)";
  digital(x,y,z);
  x=(x+((1/120)));
  y=(y+((1/10)));   
  z=(z+6);
},1*1000);

//Set the time

function show(a,b,c){
  if(a>=24)a-=12;
  x=-90 + (a*60)/2 + 30*(b/60);
  y = -90 + 6*b + 6*(c/60);
  z = -90 + 6*(c%60);
  
}
show(hours,minutes,seconds);

//Set digital time

function digital(x,y,z){
  let dhr = document.getElementById('digihr');
  let dmin = document.getElementById('digimin');
  let dsec = document.getElementById("digisec");
  times = [dhr,dmin,dsec];
  angles = [x,y,z];
  factors = [600, 10, 1/6];
  dhr.innerHTML = Math.floor((x+90)/30)%24;
  if(dhr.innerHTML.length==1)dhr.innerHTML='0'+dhr.innerHTML;
  dmin.innerHTML = (Math.floor((y+90)/6)%60);
  if(dmin.innerHTML.length==1)dmin.innerHTML='0'+dmin.innerHTML;
  dsec.innerHTML = ((z+90)/6)%60;
  if(dsec.innerHTML.length==1)dsec.innerHTML='0'+dsec.innerHTML;
}
  
  