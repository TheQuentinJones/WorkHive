const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String
    password: String    
    bio: String
    profilepicture: String
    thoughts: [Thought]
    followers: [User]
    following: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    thoughtAuthor: String
    createdAt: String
    comments: [Comment]!
  }

  type Comment {
    _id: ID
    commentText: String
    commentAuthor: String
    createdAt: String
  }

  type File {
    url: String!
    filename: String!
    encoding: String!
    mimetype: String!
  }

  type Contact {
    _id: ID
    name: String
    email: String
    message: String
  }


  type Auth {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(thoughtId: ID!): Thought
    followers: [User]
    following: [User]
    contacts: [Contact]
    contact(name: String): Contact     
  }


  type Mutation {
    addUser(email: String!, password: String!, username: String!): Auth!
    login(email: String!, password: String!): Auth!
    addThought(thoughtText: String!): Thought
    removeThought(thoughtId: ID!): Thought
    uploadImage(file: String!): File!
    updateUser(id: ID!, username: String, email: String, password: String, profilepicture: String, bio: String): User
    deleteUser(userId: ID!): User
    addFollow(userId: ID!): User
    removeFollow(userId: ID!): Boolean
    addContact(name: String, email: String, message: String): Contact
    addComment(thoughtId: ID!, commentText: String!): Thought    
  }
`;

module.exports = typeDefs;
