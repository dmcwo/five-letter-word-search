// Load the JSON data
fetch('words.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch word list.');
    }
    return response.json();
  })
  .then(data => {
    // Extract the words from the JSON data
    const wordList = data.map(item => item.word);

    // Use the wordList in your code
    // ...

    const form = document.getElementById('wordSearchForm');
    const resultsContainer = document.getElementById('results');
    const clearButton = document.getElementById('clearButton');
    const consonantCountElement = document.getElementById('consonantCount');
    const vowelCountElement = document.getElementById('vowelCount');

    clearButton.addEventListener('click', function () {
      clearSearchInputs();
      countConsonants(wordList);
      countVowels(wordList);
      console.log('Clear button clicked'); // Debugging statement
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent form submission
      performSearch();
    });

    clearButton.addEventListener('click', function () {
      clearSearchInputs();
      countConsonants(wordList);
      countVowels(wordList);
    });

    function performSearch() {
      // Get the search parameters
      const includeLetters = document.getElementById('includeLetters').value;
      const excludeLetters = document.getElementById('excludeLetters').value;
      const letterPosition = [
        document.getElementById('letter1').value,
        document.getElementById('letter2').value,
        document.getElementById('letter3').value,
        document.getElementById('letter4').value,
        document.getElementById('letter5').value,
      ];
      const excludeLetterPositions = [
        document.getElementById('excludeLetter1').value,
        document.getElementById('excludeLetter2').value,
        document.getElementById('excludeLetter3').value,
        document.getElementById('excludeLetter4').value,
        document.getElementById('excludeLetter5').value,
      ];

      // Store the search terms in an array
      const searchTerms = [includeLetters, excludeLetters, ...letterPosition, ...excludeLetterPositions];

      // Perform the search
      const filteredWords = wordList.filter(word => {
        // Check if word includes the specified letters
        if (includeLetters && !Array.from(includeLetters).every(letter => word.includes(letter))) {
          return false;
        }

        // Check if word contains any excluded letters
        if (excludeLetters && [...excludeLetters].some(letter => word.includes(letter))) {
          return false;
        }

        // Check if the specified letter is in the specified position
        if (letterPosition.some((letter, position) => letter && word.charAt(position).toLowerCase() !== letter.toLowerCase())) {
          return false;
        }

        // Check if any excluded letters are in their respective positions
        for (let i = 0; i < excludeLetterPositions.length; i++) {
          const position = i + 1;
          const excludeLetters = excludeLetterPositions[i];

          if (excludeLetters && excludeLetters.includes(word.charAt(position - 1))) {
            return false;
          }
        }

        // All criteria match, include the word in the results
        return true;
      });

      // Display the results
      displayResults(filteredWords);
      countConsonants(filteredWords);
      countVowels(filteredWords);

      // Calculate the likely letters
      const likelyLetters1 = calculateLikelyLetters(filteredWords, 0);
      const likelyLetters2 = calculateLikelyLetters(filteredWords, 1);
      const likelyLetters3 = calculateLikelyLetters(filteredWords, 2);
      const likelyLetters4 = calculateLikelyLetters(filteredWords, 3);
      const likelyLetters5 = calculateLikelyLetters(filteredWords, 4);

      // Display the likely letters
      displayLikelyLetters(1, likelyLetters1);
      displayLikelyLetters(2, likelyLetters2);
      displayLikelyLetters(3, likelyLetters3);
      displayLikelyLetters(4, likelyLetters4);
      displayLikelyLetters(5, likelyLetters5);
    }

    function calculateLikelyLetters(wordList, position) {
      const letterCount = {};

      // Count the occurrence of each letter at the specified position
      wordList.forEach(word => {
        const letter = word.charAt(position).toLowerCase();
        if (letterCount[letter]) {
          letterCount[letter]++;
        } else {
          letterCount[letter] = 1;
        }
      });

      // Sort the letters by their frequency in descending order
      const sortedLetters = Object.keys(letterCount).sort((a, b) => letterCount[b] - letterCount[a]);

      // Return the top 5 most frequently occurring letters
      return sortedLetters.slice(0, 5);
    }

    function displayResults(results) {
      resultsContainer.innerHTML = results.length > 0 ? `<p>Results: ${results.join(', ')}</p>` : '<p>No results found.</p>';
    }

    function countConsonants(words) {
      const consonantRegex = /[bcdfghjklmnpqrstvwxyz]/gi;
      const consonantCount = words.reduce((count, word) => {
        return count + (word.match(consonantRegex) || []).length;
      }, 0);
      consonantCountElement.textContent = consonantCount;
    }

    function countVowels(words) {
      const vowelRegex = /[aeiou]/gi;
      const vowelCount = words.reduce((count, word) => {
        return count + (word.match(vowelRegex) || []).length;
      }, 0);
      vowelCountElement.textContent = vowelCount;
    }

    function clearSearchInputs() {
      includeLetters.value = '';
      excludeLetters.value = '';
      letterPosition.forEach((input, index) => {
        input.value = '';
      });
      excludeLetterPositions.forEach((input, index) => {
        input.value = '';
      });
    }

    function displayLikelyLetters(position, likelyLetters) {
      const divId = `likelyLetters${position}`;
      const likelyLettersContainer = document.getElementById(divId);
      likelyLettersContainer.innerHTML = `Likely Letters ${position}: ${likelyLetters.join(', ')}`;
    }
  })
  .catch(error => {
    console.error(error);
  });
