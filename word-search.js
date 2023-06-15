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

        // Check if any
