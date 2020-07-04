import gql from "graphql-tag";

const SIGNIN_MUTATION = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!) {
    createUser(data: { email: $email, password: $password }) {
      token
    }
  }
`;

const CREATE_ENTRY_MUTATION = gql`
  mutation CreateEntryMutation(
    $title: String!
    $body: String
    $description: String
    $audioPath: String
    $audioFile: String
    $categories: [CreateCategoryInput!]
  ) {
    createEntry(
      data: {
        title: $title
        body: $body
        description: $description
        audioPath: $audioPath
        audioFile: $audioFile
        categories: $categories
      }
    ) {
      id
      title
      description
      createdAt
      updatedAt
      imagePath
      audioPath
      body
      categories {
        id
        name
        color
      }
    }
  }
`;

const UPDATE_ENTRY_MUTATION = gql`
  mutation UpdateEntryMutation(
    $id: ID!
    $title: String!
    $body: String
    $description: String
    $categories: [CreateCategoryInput!]
  ) {
    updateEntry(
      data: {
        id: $id
        title: $title
        body: $body
        description: $description
        categories: $categories
      }
    ) {
      id
      title
      description
      createdAt
      updatedAt
      imagePath
      audioPath
      body
      categories {
        id
        name
        color
      }
    }
  }
`;

const DELETE_ENTRY_MUTATION = gql`
  mutation DeleteEntryMutation($id: ID!) {
    deleteEntry(id: $id) {
      id
    }
  }
`;

const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategoryMutation($name: String!, $color: String!) {
    createCategory(data: { name: $name, color: $color }) {
      id
      name
      color
    }
  }
`;

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategoryMutation($name: String!, $color: String!, $id: ID!) {
    updateCategory(data: { id: $id, name: $name, color: $color }) {
      id
      name
      color
    }
  }
`;

const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategoryMutation($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

export {
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_MUTATION,
  CREATE_ENTRY_MUTATION,
  UPDATE_ENTRY_MUTATION,
  DELETE_ENTRY_MUTATION,
  SIGNIN_MUTATION,
  SIGNUP_MUTATION,
};
