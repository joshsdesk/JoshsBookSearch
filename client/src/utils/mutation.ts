import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation ($input: addUser!) {
    addUser(input: $input) {
      user {
        username
        _id
      }
      token
    }
  }
`;

export const SAVE_BOOK = gql`
mutation saveBook($input: saveBookInput!) {
saveBook(input: $input) {
authors
description
title
image
link
  }
}
`;

export const REMOVE_BOOK = gql`
mutation removeBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}
`;
