const typeDefs = ` 
type User {
    _id: ID
    username: String
    email: String
    bookCount: String
    savedBooks: [Book]!
}

input addUser {
username: String!
email: String!
password: String!
}

type Book {
bookId: ID
authors: [String]
description: String
title: String
image: String
link: String
}

input saveBookInput {
  bookId: String
  authors: [String]
  description: String
  title: String!
  image: String
  link: String
}

type Auth {
token: ID
user: User
}

type Query {
me: User
}

type Mutation {
    login(email: String!, password: String!): Auth         
    addUser(input: addUser!): Auth                        
    saveBook(input: saveBookInput!): Book                       
    removeBook(bookId: ID!): User                      
}
`;

export default typeDefs;