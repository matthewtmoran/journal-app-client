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

export { SIGNIN_MUTATION, SIGNUP_MUTATION };
