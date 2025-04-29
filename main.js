let currentEditItem = null;

const updateItemNumbers = () => {
  const items = document.querySelectorAll(
    '#myUL li:not([style*="display: none"])'
  );
  items.forEach((item, index) => {
    let numberSpan = item.querySelector('.item-number');
    if (!numberSpan) {
      numberSpan = document.createElement('span');
      numberSpan.className = 'item-number';
      item.insertBefore(numberSpan, item.firstChild);
    }
    numberSpan.textContent = `${index + 1}. `;
  });
};

const addItem = () => {
  const inputValue = document.getElementById('inputItem').value.trim();
  const quantityValue = document.getElementById('quantity').value.trim();

  const ul = document.getElementById('myUL');

  if (inputValue === '' || quantityValue === '') {
    alert('You must write sth!');
    return;
  }

  const li = document.createElement('li');
  li.setAttribute('draggable', 'true');
  li.classList.add('draggable');

  const numberSpan = document.createElement('span');
  numberSpan.className = 'item-number';
  li.appendChild(numberSpan);

  const t = document.createTextNode(`${inputValue} - ${quantityValue}`);
  li.appendChild(t);
  ul.appendChild(li);

  document.getElementById('inputItem').value = '';
  document.getElementById('quantity').value = '';

  li.addEventListener('click', function (e) {
    if (e.target === this || e.target.classList.contains('item-number')) {
      this.classList.toggle('checked');
    }
  });

  li.addEventListener('dragstart', dragstartHandler);

  const span = document.createElement('SPAN');
  const txt = document.createTextNode('\u00D7');
  span.className = 'close';
  span.appendChild(txt);
  li.appendChild(span);

  span.onclick = function (e) {
    e.stopPropagation();
    const div = this.parentElement;
    div.style.display = 'none';
    updateItemNumbers();
  };

  const editSpan = document.createElement('SPAN');
  const editTxt = document.createTextNode('✎');
  editSpan.className = 'edit';
  editSpan.appendChild(editTxt);
  li.appendChild(editSpan);

  editSpan.onclick = function (e) {
    e.stopPropagation();
    openEditModal(li);
  };

  updateItemNumbers();
};

const openEditModal = (li) => {
  const contentNodes = Array.from(li.childNodes).filter(
    (node) =>
      node.nodeType === Node.TEXT_NODE ||
      !node.classList.contains('item-number')
  );

  let currentText = '';
  for (const node of contentNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      currentText += node.textContent;
    }
  }

  currentText = currentText.trim();
  const [currentItem, currentQuantity] = currentText.split(' - ');

  currentEditItem = li;

  document.getElementById('editItemInput').value = currentItem;
  document.getElementById('editQuantityInput').value = currentQuantity;

  document.getElementById('editModal').style.display = 'block';

  document.getElementById('editItemInput').focus();
};

const closeEditModal = () => {
  document.getElementById('editModal').style.display = 'none';
  currentEditItem = null;
};

const saveEditedItemModal = () => {
  if (!currentEditItem) return;

  const newItem = document.getElementById('editItemInput').value.trim();
  const newQuantity = document.getElementById('editQuantityInput').value.trim();

  if (newItem === '' || newQuantity === '') {
    alert('Fields cannot be empty');
    return;
  }

  const wasChecked = currentEditItem.classList.contains('checked');

  let numberSpan = currentEditItem.querySelector('.item-number');
  const numberText = numberSpan ? numberSpan.textContent : '';

  currentEditItem.innerHTML = '';

  if (numberText) {
    numberSpan = document.createElement('span');
    numberSpan.className = 'item-number';
    numberSpan.textContent = numberText;
    currentEditItem.appendChild(numberSpan);
  }

  const t = document.createTextNode(`${newItem} - ${newQuantity}`);
  currentEditItem.appendChild(t);

  const span = document.createElement('SPAN');
  const txt = document.createTextNode('\u00D7');
  span.className = 'close';
  span.appendChild(txt);
  currentEditItem.appendChild(span);

  span.onclick = function (e) {
    e.stopPropagation();
    const div = this.parentElement;
    div.style.display = 'none';
    updateItemNumbers();
  };

  const editSpan = document.createElement('SPAN');
  const editTxt = document.createTextNode('✎');
  editSpan.className = 'edit';
  editSpan.appendChild(editTxt);
  currentEditItem.appendChild(editSpan);

  editSpan.onclick = function (e) {
    e.stopPropagation();
    openEditModal(currentEditItem);
  };

  currentEditItem.addEventListener('click', function (e) {
    if (e.target === this || e.target.classList.contains('item-number')) {
      this.classList.toggle('checked');
    }
  });

  if (wasChecked) {
    currentEditItem.classList.add('checked');
  }

  closeEditModal();
};

const deleteAllItems = () => {
  const confirmDelete = confirm('You sure to delete all items?');

  if (confirmDelete) {
    const ul = document.getElementById('myUL');
    ul.innerHTML = '';
    alert('All items deleted!');
    const items = document.querySelectorAll('li');
    items.forEach((item) => {
      item.remove();
    });
  }
};

const searchItems = () => {
  document.getElementById('searchModal').style.display = 'block';
  document.getElementById('modalSearchInput').focus();
};

const closeModal = () => {
  document.getElementById('searchModal').style.display = 'none';
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('modalSearchInput').value = '';
};

const performModalSearch = () => {
  const searchQuery = document
    .getElementById('modalSearchInput')
    .value.toLowerCase()
    .trim();
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';

  if (searchQuery === '') {
    const emptyMsg = document.createElement('li');
    emptyMsg.textContent = 'Please enter a search term';
    emptyMsg.className = 'search-message';
    searchResults.appendChild(emptyMsg);
    return;
  }

  const items = document.querySelectorAll('#myUL li');
  let hasResults = false;

  items.forEach((item) => {
    const itemText = item.textContent.toLowerCase();
    if (itemText.includes(searchQuery)) {
      hasResults = true;

      const contentNodes = Array.from(item.childNodes).filter(
        (node) => node.nodeType === Node.TEXT_NODE
      );

      let itemContent = '';
      for (const node of contentNodes) {
        itemContent += node.textContent;
      }
      itemContent = itemContent.trim();

      const resultItem = document.createElement('li');
      resultItem.className = 'search-result-item';

      const numberSpan = document.createElement('span');
      const originalNumberSpan = item.querySelector('.item-number');
      numberSpan.className = 'item-number';
      numberSpan.textContent = originalNumberSpan
        ? originalNumberSpan.textContent
        : '';
      resultItem.appendChild(numberSpan);

      resultItem.appendChild(document.createTextNode(itemContent));

      searchResults.appendChild(resultItem);
    }
  });

  if (!hasResults) {
    const noResultsMsg = document.createElement('li');
    noResultsMsg.textContent = 'No results found';
    noResultsMsg.className = 'search-message';
    searchResults.appendChild(noResultsMsg);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('inputItem')
    .addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        if (this.value.trim() !== '') {
          document.getElementById('quantity').focus();
        }
      }
    });

  document
    .getElementById('quantity')
    .addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        addItem();
      }
    });

  document
    .getElementById('editItemInput')
    .addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        if (this.value.trim() !== '') {
          document.getElementById('editQuantityInput').focus();
        }
      }
    });

  document
    .getElementById('editQuantityInput')
    .addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        saveEditedItemModal();
      }
    });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      closeEditModal();
    }
  });

  document
    .getElementById('modalSearchInput')
    .addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        performModalSearch();
      }
    });
});

//////////////////////////

let dragSrcElement = null;

const dragstartHandler = (e) => {
  dragSrcElement = e.target;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
  e.target.classList.add('dragging');
};

const dragoverHandler = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  const targetElement = e.target.closest('li');
  if (targetElement && dragSrcElement !== targetElement) {
    targetElement.classList.add('over');
  }

  return false;
};

const dropHandler = (e) => {
  e.preventDefault();

  const targetElement = e.target.closest('li');

  if (targetElement && dragSrcElement !== targetElement) {
    const list = document.getElementById('myUL');
    const items = Array.from(list.querySelectorAll('li'));
    const fromIndex = items.indexOf(dragSrcElement);
    const toIndex = items.indexOf(targetElement);

    if (fromIndex < toIndex) {
      targetElement.parentNode.insertBefore(
        dragSrcElement,
        targetElement.nextSibling
      );
    } else {
      targetElement.parentNode.insertBefore(dragSrcElement, targetElement);
    }

    document.querySelectorAll('li').forEach((item) => {
      item.classList.remove('over');
    });

    updateItemNumbers();
  }

  dragSrcElement.classList.remove('dragging');
  return false;
};
