import React, { Component } from "react";
import PropTypes from "prop-types";
import BookShelfChanger from "./BookShelfChanger";

/**
 * This class defines the Component that displays a list of books based on shelf
 */
class BookList extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    filter: PropTypes.string
  };
  /**
   * @constructor
   * @param {Object} props 
   */
  constructor(props) {
    super(props);
    this.getBookCurrentShelf = this.getBookCurrentShelf.bind(this);
  }
  /**
   * @returns {string} shelf
   * @param {*} bookId 
   * @description This Method takes a book Id and returns the books shelf
   */
  getBookCurrentShelf(bookId) {
    const bookOnShelf = this.props.books.filter(book => {
      if (bookId === book.id) {
        if (book.shelf) {
          return true;
        }
      }
      return false;
    });
    if (bookOnShelf && bookOnShelf[0]) {
      return bookOnShelf[0].shelf;
    }
    return "none";
  }
  render() {
    const filter = this.props.filter;
    const filteredBooks = filter
      ? this.props.books.filter(book => book.shelf === filter)
      : this.props.queryResults;
    return (
      <ol className="books-grid">
        {filteredBooks &&
          filteredBooks.map(book => {
            let shelf = this.getBookCurrentShelf(book.id);
            shelf = shelf ? shelf : filter;
            return (
              <li key={book.id}>
                <div className="book">
                  <div className="book-top">
                    {book.imageLinks && (
                      <div
                        className="book-cover"
                        style={{
                          width: 128,
                          height: 188,
                          backgroundImage: `url(${book.imageLinks.thumbnail})`
                        }}
                      ></div>
                    )}
                    <BookShelfChanger
                      bookId={book.id}
                      currentShelf={shelf}
                      handleChange={this.props.handleChange}
                    />
                  </div>
                  {book.title && <div className="book-title">{book.title}</div>}
                  {book.authors &&
                    book.authors.map(author => {
                      return (
                        <div className="book-authors" key={author}>
                          {author}
                        </div>
                      );
                    })}
                </div>
              </li>
            );
          })}
      </ol>
    );
  }
}

export default BookList;
