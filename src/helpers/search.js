const distance = require(`fast-levenshtein`);

// Take a string and an input, and highlight any part of the string that
// matches the input
function highlightMatchingString(itemName, input) {
  const lowercaseItemName = itemName.toLowerCase();
  const idx = lowercaseItemName.indexOf(input);
  // use itemName rather than lowercaseItemName below so that original case is maintained
  const beforeHighlight = itemName.substring(0, idx);
  const highlight = itemName.substring(idx, idx + input.length);
  const afterHighlight = itemName.substring(idx + input.length);
  return `${beforeHighlight}<span class='highlight'>${highlight}</span>${afterHighlight}`;
}

// TODO: see if we can handle this in a cleaner way that separates out functionality
function addHighlightAndSortInfo(item, searchInput, property) {
  let newItem = {...item};
  if (!newItem[property]) return item;
  const lowercaseItemName = newItem[property].toLowerCase();
  const input = searchInput.toLowerCase();

  const startsWithInput = lowercaseItemName.startsWith(input);
  const longEnoughMatch = input.length > 1 && lowercaseItemName.includes(input);
  if (startsWithInput || longEnoughMatch) {
    newItem.highlighted = highlightMatchingString(newItem[property], input);
    // rank items that start with the input highest
    newItem.sortLevel = startsWithInput ? 1 : 2;
  } else {
    // for all words in the search input and for all words in the item name,
    // if there are any matches, include them and sort them by Levenshtein
    // distance, but sort them all below matches with sortLevel 1 or 2
    // (startsWithInput or longEnoughMatch) by adding 3 to Levenshtein distance
    let inputIncludesItem = false;

    for (const itemWord of lowercaseItemName.split(` `)) {
      for (const inputWord of input.split(` `)) {
        if (
          itemWord.startsWith(inputWord) &&
          inputWord.length > 1
        ) {
          inputIncludesItem = true;
          // get Levenshtein or "edit" distance of strings to sort among any matches
          newItem.sortLevel = 3 + distance.get(lowercaseItemName, searchInput);
        }
      }
    }
    if (inputIncludesItem) {
      newItem.highlighted = newItem[property];
    }
  }

  return newItem;
}

export {
  addHighlightAndSortInfo,
};
