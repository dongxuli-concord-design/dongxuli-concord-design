function XcGsAssert({assertion, message = 'Unknown'}) {
  if (!assertion) {
    const error = new Error(message);
    throw error;
  }
}