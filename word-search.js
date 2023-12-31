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

      // Apply CSS class to search terms
      applySearchTermsStyle(searchTerms);
    }

    function applySearchTermsStyle(searchTerms) {
  const resultContainer = document.getElementById('results');
  const resultItems = resultContainer.getElementsByTagName('li');

  Array.from(resultItems).forEach(item => {
    const word = item.textContent.toLowerCase();
    let highlightedWord = '';

    // Apply CSS class to letters in the word that match the search terms
    Array.from(word).forEach(letter => {
      const lowerCaseLetter = letter.toLowerCase();
      const matchedTerm = searchTerms.find(term => term && lowerCaseLetter.includes(term.toLowerCase()));

      if (matchedTerm) {
        const regex = new RegExp(matchedTerm, 'gi');
        highlightedWord += `<span class="insearchterms">${letter.replace(regex, matchedTerm)}</span>`;
      } else {
        highlightedWord += letter;
      }
    });

    item.innerHTML = highlightedWord;
  });
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
      consonantCountElement.innerHTML = '<h3>Consonant Count</h3>';
      const consonantList = Object.keys(consonantCount)
        .sort((a, b) => consonantCount[b] - consonantCount[a])
        .map(consonant => `${consonant}: ${consonantCount[consonant]}`)
        .join(' | ');
      consonantCountElement.innerHTML += consonantList;
    }

    function countVowels(words) {
      // Count the occurrences of vowels in the words
      const vowelCount = {};

      words.forEach(word => {
        const vowels = word.replace(/[^aeiou]/gi, '');
        for (let i = 0; i < vowels.length; i++) {
          const vowel = vowels[i].toLowerCase();
          vowelCount[vowel] = vowelCount[vowel] ? vowelCount[vowel] + 1 : 1;
        }
      });

      // Display the vowel count
      vowelCountElement.innerHTML = '<h3>Vowel Count</h3>';
      const vowelList = Object.keys(vowelCount)
        .sort((a, b) => vowelCount[b] - vowelCount[a])
        .map(vowel => `${vowel}: ${vowelCount[vowel]}`)
        .join(' | ');
      vowelCountElement.innerHTML += vowelList;
    }

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

      // Clear consonant count
      consonantCountElement.innerHTML = '';

      // Clear vowel count
      vowelCountElement.innerHTML = '';
    }

    // Initialize the page with consonant and vowel counts based on full word list
    countConsonants(wordList);
    countVowels(wordList);
  })
  .catch(error => {
    console.error(error);
    // Handle any error that occurred during the fetch
  });