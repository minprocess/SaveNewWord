document.addEventListener('DOMContentLoaded', () => {
  let db;
  const request = indexedDB.open('FrenchWords', 1);

  request.onsuccess = (event) => {
      db = event.target.result;
      displayRecords();
  };

  request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
  };

  function displayRecords() {
      const transaction = db.transaction(['words'], 'readonly');
      const objectStore = transaction.objectStore('words');
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
          const records = event.target.result;
          const tbody = document.getElementById('recordsTable').getElementsByTagName('tbody')[0];

          records.forEach(record => {
              const row = tbody.insertRow();
              row.insertCell(0).textContent = record.frenchWord;
              row.insertCell(1).textContent = record.englishTranslation;
              row.insertCell(2).textContent = record.frenchSentence;
              row.insertCell(3).textContent = record.englishSentence;
              row.insertCell(4).textContent = record.familiarity;
          });
      };

      request.onerror = (event) => {
          console.error('Error reading records:', event.target.errorCode);
      };
  }
});