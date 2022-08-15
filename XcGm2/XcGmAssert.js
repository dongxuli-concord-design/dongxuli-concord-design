function XcGmAssert({expression, name = null, message = 'Unknown'}) {
  if (!expression) {
    let error = new Error(message);
    if (name) {
      error.name = name;
    }
    throw error;
  }
}
