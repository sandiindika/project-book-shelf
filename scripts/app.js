const RENDER_EVENT = 'render-books';
const STORAGE_KEY = 'BOOK_LIBRARY';

let books = [];

const isStorageAvailable = () => {
  if (typeof Storage === undefined) {
    alert('Storage not supported');
    return false;
  }
  return true;
};

const loadBooksFromStorage = () => {
  const storedBooks = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (storedBooks !== null) {
    books = storedBooks;
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveBooksToStorage = () => {
  if (isStorageAvailable()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
};

document.addEventListener(RENDER_EVENT, () => {
  const unreadBooksContainer = document.getElementById('unreadBooks');
  unreadBooksContainer.innerHTML = '';

  const readBooksContainer = document.getElementById('readBooks');
  readBooksContainer.innerHTML = '';

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (!book.isComplete) {
      unreadBooksContainer.append(bookElement);
    } else {
      readBooksContainer.append(bookElement);
    }
  }
});

const createBookElement = (book) => {
  const titleElement = document.createElement('p');
  titleElement.classList.add('book-title');
  titleElement.innerText = `${book.title} (${book.year})`;

  const authorElement = document.createElement('p');
  authorElement.classList.add('book-author');
  authorElement.innerText = `by ${book.author}`;

  const container = document.createElement('div');
  container.classList.add('book-item');
  container.append(titleElement, authorElement);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('actions');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-btn');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
    removeBook(book.id);
  });

  const completeButton = document.createElement('button');
  completeButton.classList.add('complete-btn');
  completeButton.innerText = book.isComplete ? 'Undo' : 'Complete';
  completeButton.addEventListener('click', () => {
    toggleBookCompletion(book.id);
  });

  actionContainer.append(completeButton, deleteButton);
  container.append(actionContainer);

  return container;
};

const addBook = (title, author, year, isComplete) => {
  const newBook = {
    id: +new Date(),
    title,
    author,
    year: Number(year),
    isComplete,
  };

  books.push(newBook);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBooksToStorage();
};

const removeBook = (bookId) => {
  books = books.filter(book => book.id !== bookId);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBooksToStorage();
};

const toggleBookCompletion = (bookId) => {
  const book = books.find(book => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBooksToStorage();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (isStorageAvailable()) {
    loadBooksFromStorage();
  }

  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const year = document.getElementById('bookYear').value;
    const isComplete = document.getElementById('bookCompleted').checked;

    addBook(title, author, year, isComplete);
    bookForm.reset();
  });

  const searchForm = document.getElementById('searchForm');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value.toLowerCase();

    const filteredBooks = books.filter(book => {
      return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
    });

    displaySearchResults(filteredBooks);
  });
});

const displaySearchResults = (books) => {
  const unreadBooksContainer = document.getElementById('unreadBooks');
  unreadBooksContainer.innerHTML = '';

  const readBooksContainer = document.getElementById('readBooks');
  readBooksContainer.innerHTML = '';

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (!book.isComplete) {
      unreadBooksContainer.append(bookElement);
    } else {
      readBooksContainer.append(bookElement);
    }
  }
};
