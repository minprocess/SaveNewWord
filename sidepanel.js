document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('language-select').addEventListener('change', function() {
    const selectedLang = this.value;
    document.getElementById('note').setAttribute('lang', selectedLang);
  });


  let focusedTextbox = null;

  document.querySelectorAll('.textbox').forEach(textbox => {
      textbox.addEventListener('focus', (event) => {
          focusedTextbox = event.target;
      });
  });
  
  function addCharacter(character) {
      if (focusedTextbox) {
          const start = focusedTextbox.selectionStart;
          const end = focusedTextbox.selectionEnd;
          const text = focusedTextbox.value;
          focusedTextbox.value = text.slice(0, start) + character + text.slice(end);
          focusedTextbox.focus();
          focusedTextbox.selectionStart = focusedTextbox.selectionEnd = start + character.length;
      } else {
          alert('Please focus on a text box first.');
      }
  }

  const accentarr = ['à', 'â', 'æ', 'ç', 'é', 'è', 'ê', 'ë', 'ï', 'î', 'ô', 'œ',
  'ù', 'û', 'ü', 'ÿ', '€', '“', '”', '«', '»']
  const accentButtonsDiv = document.getElementById('accent-buttons');
  accentarr.forEach(character => {
    const button = document.createElement('button');
    button.textContent = character;
    button.addEventListener('click', function() {
      addCharacter(character);
    });
    accentButtonsDiv.appendChild(button);
  });

  let db;
  const request = indexedDB.open('FrenchWords', 1);

  request.onupgradeneeded = (event) => {
      db = event.target.result;
      const objectStore = db.createObjectStore('words', { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('frenchWord', 'frenchWord', { unique: false });
  };

  request.onsuccess = (event) => {
      db = event.target.result;
  };

  request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
  };

  document.getElementById('wordForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const frenchWord = document.getElementById('frenchWord').value;
    const partOfSpeech = document.getElementById('partOfSpeech').value;
    const englishTranslation = document.getElementById('englishTranslation').value;
    const frenchSentence = document.getElementById('frenchSentence').value;
    const englishSentence = document.getElementById('englishSentence').value;
    const familiarity = parseInt(document.getElementById('familiarity').value);
    const comment = document.getElementById('comment').value;

    const transaction = db.transaction(['words'], 'readwrite');
    const objectStore = transaction.objectStore('words');
    const request = objectStore.add({
        frenchWord,
        partOfSpeech,
        englishTranslation,
        frenchSentence,
        englishSentence,
        familiarity,
        comment
    });

    request.onsuccess = () => {
        alert('Word saved successfully!');
        document.getElementById('wordForm').reset();
    };

      request.onerror = (event) => {
          console.error('Error saving word:', event.target.errorCode);
      };
  });

  document.getElementById('viewRecordsButton').addEventListener('click', () => {
    chrome.tabs.create({ url: 'viewRecords.html' });
  });
});