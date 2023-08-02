import { GraphQLFormattedError } from 'graphql';

export default function formatGraphqlError(
  error: GraphQLFormattedError,
): GraphQLFormattedError {
  const graphQLFormattedError: GraphQLFormattedError = {
    message: error.message,
    path: error.path,
    extensions: {
      statusCode: error.extensions?.status,
      error: error.extensions?.error,
    },
  };
  return graphQLFormattedError;
}
