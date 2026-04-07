export function graphqlErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const e = error as { graphQLErrors?: { message?: string }[]; networkError?: { message?: string }; message?: string };
    const gqlMsg = e.graphQLErrors?.[0]?.message;
    if (gqlMsg) return gqlMsg;
    const net = e.networkError?.message;
    if (net) return net;
    if (typeof e.message === 'string' && e.message) return e.message;
  }
  return 'Something went wrong';
}
