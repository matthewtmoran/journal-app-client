import gql from "graphql-tag";

export const ENTRIES_QUERY = gql`
  query EntiesQuery {
    entries {
      id
      title
      description
      imagePath
      audioPath
      body
      createdAt
      updatedAt
      categories {
        id
        name
        color
      }
    }
  }
`;

export const CATEGORIES_QUERY = gql`
  query CategoriesQuery {
    categories {
      id
      name
      color
    }
  }
`;
