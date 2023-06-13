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

    clearButton.addEventListener('click', function () {
      clearSearchInputs();
      console.log('Clear button clicked'); // Debugging statement
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent form submission
      performSearch();
    });

    clearButton.addEventListener('click', function () {
      clearSearchInputs();
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
    }

    function displayResults(words) {
      // Clear previous results
      resultsContainer.innerHTML = '';

      if (words.length === 0) {
        resultsContainer.textContent = 'No matching words found.';
      } else {
        const list = document.createElement('ul');
        words.forEach(word => {
          const listItem = document.createElement('li');
          listItem.textContent = word;
          list.appendChild(listItem);
        });
        resultsContainer.appendChild(list);
      }

      // Display the total count
      const resultCountElement = document.getElementById('resultCount');
      resultCountElement.textContent = `Total results found: ${words.length}`;
    }

    //start-new
    
    function countConsonants(words) {
      // Count the occurrences of consonants in the words
      const consonantCount = {};

      words.forEach(word => {
        const consonants = word.replace(/[aeiou]/gi, '');
        for (let i = 0; i < consonants.length; i++) {
          const consonant = consonants[i].toLowerCase();
          consonantCount[consonant] = consonantCount[consonant] ? consonantCount[consonant] + 1 : 1;
        }
      });

      // Display the consonant count
      const consonantCountElement = document.getElementById('consonantCount');
      consonantCountElement.innerHTML = '<h3>Consonant Count</h3>';
      const consonantList = document.createElement('ul');
      Object.keys(consonantCount).forEach(consonant => {
        const listItem = document.createElement('li');
        listItem.textContent = `${consonant}: ${consonantCount[consonant]}`;
        consonantList.appendChild(listItem);
      });
      consonantCountElement.appendChild(consonantList);
    }
    
    //end-new
    
    
    function clearSearchInputs() {
      document.getElementById('includeLetters').value = '';
      document.getElementById('excludeLetters').value = '';
      document.getElementById('letter1').value = '';
      document.getElementById('letter2').value = '';
      document.getElementById('letter3').value = '';
      document.getElementById('letter4').value = '';
      document.getElementById('letter5').value = '';
      document.getElementById('excludeLetter1').value = '';
      document.getElementById('excludeLetter2').value = '';
      document.getElementById('excludeLetter3').value = '';
      document.getElementById('excludeLetter4').value = '';
      document.getElementById('excludeLetter5').value = '';
      
      // Clear search results
      resultsContainer.innerHTML = '';

      // Clear total results count
      const resultCountElement = document.getElementById('resultCount');
      resultCountElement.textContent = '';
    }
  })
  .catch(error => {
    console.error(error);
    // Handle any error that occurred during the fetch
  });
