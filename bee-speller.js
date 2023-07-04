document.addEventListener('DOMContentLoaded', function () {
  const wordForm = document.getElementById('wordForm');
  const resultDiv = document.getElementById('resultList');
  const pangramDiv = document.getElementById('pangramList');
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
    const lettersInput = document.getElementById('lettersInput').value.toLowerCase();
    const magicLetterInput = document.getElementById('magicLetterInput').value.toLowerCase();
    
    if (lettersInput.length !== 6) {
      alert('Please enter exactly 6 letters.');
      return;
    }

    const wordsWithMagicLetter = filterWordsWithMagicLetter(allWords, magicLetterInput);
    const filteredWords = filterWordsWithGivenLetters(wordsWithMagicLetter, magicLetterInput + lettersInput);

    const sortOption = document.getElementById('sortOptions').value || 'length'; // Default to 'length' if no option selected
    const sortedWords = sortWords(filteredWords, sortOption);

    const pangramList = filterPangrams(sortedWords, magicLetterInput + lettersInput);
    displayWords(pangramList, pangramDiv);
    displayWords(sortedWords, resultDiv);
  });

  function filterWordsWithMagicLetter(words, magicLetter) {
    return words.filter(word => word.includes(magicLetter));
  }

  function filterWordsWithGivenLetters(words, letters) {
    const lettersSet = new Set(letters);
    return words.filter(word => {
      const wordSet = new Set(word);

      for (const letter of wordSet) {
        if (!lettersSet.has(letter)) {
          return false;
        }
      }

      return true;
    });
  }

  function filterPangrams(words, requiredLetters) {
    return words.filter(word => {
      const lettersSet = new Set(requiredLetters);
      for (const letter of word) {
        lettersSet.delete(letter);
      }
      return lettersSet.size === 0;
    });
  }

  function sortWords(words, option) {
    if (option === 'alphabetical') {
      return words.sort();
    } else if (option === 'length') {
      return words.sort((a, b) => b.length - a.length); // Sort by length, longest first
    } else {
      return words; // Default to no sorting if the option is not recognized
    }
  }

  function displayWords(words, targetDiv) {
    targetDiv.textContent = ''; // Clear previous results

    if (words.length === 0) {
      targetDiv.textContent = 'No words found with these letters.';
    } else {
      const list = document.createElement('ul');
      words.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        list.appendChild(listItem);
      });
      targetDiv.appendChild(list);
    }
  }
});
