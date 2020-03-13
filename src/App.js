import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import BookList from "./BookList";
import { Route, Link } from "react-router-dom";

/**
 * This is the Main component for the MyReads App
 */
class BooksApp extends React.Component {
  state = {
    books: [],
    searchInput: "",
    queryResults: []
  };
  /**
   * @constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.moveBookToShelf = this.moveBookToShelf.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }
  /**
   * @description Handles the change of the search input field, updates the state of the query
   * @param {Event} event Search Textfield change event
   */
  async handleSearchInputChange(event) {
    const query = event.target.value;
    const searchResults = await BooksAPI.search(query);
    this.setState((currentState, props) => {
      if (searchResults instanceof Array)
        return {
          queryResults: searchResults,
          searchInput: query
        };
      else
        return {
          queryResults: [],
          searchInput: query
        };
    });
  }
  /**
   * @description Method Called immediately after render of the component. Gets all books and updates the books states.
   */
  async componentDidMount() {
    await this.getAllBooks().then(response => {
      this.setState((currentState, props) => {
        return { books: response };
      });
    });
  }
  /**
   * @returns {Array} books
   * @description Wrapper method for the BooksAPI.getAll API.
   */
  async getAllBooks() {
    return await BooksAPI.getAll().then(response => response);
  }
  /**
   *
   * @param {Event} event
   * @description This method handles the event a user selects a different shelf for a book.
   */
  async moveBookToShelf(event) {
    const newShelf = event.target.value;
    const id = event.target.getAttribute("data-book-id");
    await BooksAPI.get(id)
      .then(book => {
        BooksAPI.update(book, newShelf);
        book.shelf = newShelf;
        return book;
      })
      .then(newBook => {
        let bookFound = false;
        const updatedBooks = this.state.books.map(book => {
          if (book.id === id) {
            book.shelf = newShelf;
            bookFound = true;
          }
          return book;
        });
        if (!bookFound) {
          this.setState((currentState, props) => {
            currentState.books.push(newBook);
            return { books: currentState.books };
          });
        } else {
          this.setState((currentState, props) => {
            return { books: updatedBooks };
          });
        }
      });
  }
  /**
   * @description Renders all the components for the application, based on the current route.
   */
  render() {
    return (
      <div className="app">
        <Route
          path="/search"
          render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/">
                  <button className="close-search">Close</button>
                </Link>
                <div className="search-books-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    onChange={this.handleSearchInputChange}
                    value={this.state.searchInput}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <BookList
                  books={this.state.books}
                  queryResults={this.state.queryResults}
                  handleChange={this.moveBookToShelf}
                />
              </div>
            </div>
          )}
        />
        <Route
          exact
          path="/"
          render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Currently Reading</h2>
                    <div className="bookshelf-books">
                      <BookList
                        books={this.state.books}
                        handleChange={this.moveBookToShelf}
                        filter="currentlyReading"
                      />
                    </div>
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Want to Read</h2>
                    <div className="bookshelf-books">
                      <BookList
                        books={this.state.books}
                        handleChange={this.moveBookToShelf}
                        filter="wantToRead"
                      />
                    </div>
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Read</h2>
                    <div className="bookshelf-books">
                      <BookList
                        books={this.state.books}
                        handleChange={this.moveBookToShelf}
                        filter="read"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="open-search">
                <Link to="/search">
                  <button>Add a book</button>
                </Link>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
