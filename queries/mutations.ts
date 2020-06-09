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

export { CREATE_ENTRY_MUTATION, SIGNIN_MUTATION, SIGNUP_MUTATION };
