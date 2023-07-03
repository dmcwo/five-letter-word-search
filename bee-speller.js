document.addEventListener('DOMContentLoaded', function () {
  const wordForm = document.getElementById('wordForm');
  const resultDiv = document.getElementById('result');
  const wordsURL = 'words-all.json';

  let allWords = []; // To store the collection of words

  // Fetch the words from the JSON file
  fetch(wordsURL)
    .then(response => response.json())
    .then(data => {
      allWords = data.map(obj => obj.word); // Extract "word" property from each object
    })
    .catch(error => console.error('Error fetching words:', error));

  wordForm.addEventListener('submit', function (event) {
    event.preventDefault();
    resultDiv.textContent = ''; // Clear previous results

    const lettersInput = document.getElementById('lettersInput').value.toLowerCase();
    const extraLetterInput = document.getElementById('extraLetterInput').value.toLowerCase();
    
    if (lettersInput.length !== 6) {
      alert('Please enter exactly 6 letters.');
      return;
    }

    const filteredWords = filterWords(lettersInput, extraLetterInput);
    displayWords(filteredWords);
  });

  function filterWords(letters, extraLetter) {
    const lettersSet = new Set(letters);
    return allWords.filter(word => {
      const wordSet = new Set(word);

      for (const letter of wordSet) {
        if (!lettersSet.has(letter)) {
          return false;
        }
      }

      return !extraLetter || wordSet.has(extraLetter);
    });
  }

  function displayWords(words) {
    const resultDiv = document.getElementById('result');
    if (words.length === 0) {
      resultDiv.textContent = 'No words found with these letters.';
    } else {
      const list = document.createElement('ul');
      words.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        list.appendChild(listItem);
      });
      resultDiv.appendChild(list);
    }
  }
});
