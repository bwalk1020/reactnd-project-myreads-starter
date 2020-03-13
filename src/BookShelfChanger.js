import React, { Component } from "react";
import PropTypes from "prop-types";

class BookShelfChanger extends Component {
  static propTypes = {
    bookId: PropTypes.string.isRequired,
    currentShelf: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired
  };
  render() {
    return (
      <div className="book-shelf-changer">
        <select
          defaultValue={this.props.currentShelf}
          onChange={this.props.handleChange}
          data-book-id={this.props.bookId}
        >
          <option value="move" disabled>
            Move to...
          </option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      </div>
    );
  }
}

export default BookShelfChanger;
