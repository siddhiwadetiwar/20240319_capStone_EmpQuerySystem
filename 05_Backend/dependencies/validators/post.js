// Validate each and every property of the post object

/** Helper function to validate Post Content */
function postContentValidator(postContent) {
  // Check for string
  if (typeof postContent !== "string") {
    return false;
  }
  // Check for length
  if (postContent.length < 10 || postContent.length > 1000) {
    return false;
  }
  return true;
}

/** Helper function to validate Post Type */
function postTypeValidator(postType) {
  // Check for string and allowed types
  if (typeof postType !== "string" || !['educational', 'entertainment', 'personal'].includes(postType)) {
    return false;
  }
  return true;
}

/** Helper function to validate Images Array */
function imagesValidator(images) {
  // Check for array
  if (!Array.isArray(images)) {
    return false;
  }
  // Check if each element is a string (URL)
  for (const image of images) {
    if (typeof image !== 'string') {
      return false;
    }
    // You can add more specific URL validation if needed
  }
  return true;
}

/** Helper function to validate Post Upvotes Count */
function upvotesCountValidator(upvotesCount) {
  // Check for number
  if (typeof upvotesCount !== "number" || upvotesCount < 0) {
    return false;
  }
  return true;
}

/** Helper function to validate Post Downvotes Count */
function downvotesCountValidator(downvotesCount) {
  // Check for number
  if (typeof downvotesCount !== "number" || downvotesCount < 0) {
    return false;
  }
  return true;
}

// Validator for comment content
function commentContentValidator(commentContent) {
  if (!commentContent || typeof commentContent !== 'string' || commentContent.trim().length === 0) {
    return false;
  }
  return true;
}
// Helper function to check if a string is alphanumeric
function isAlphaNumeric(str) {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(str);
}
// Validator for username
function usernameValidator(username) {
  // Check if the username is undefined, null, or an empty string
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return false; // Invalid username format
  }

  // Additional validation logic if needed

  return true; // Valid username format
}

// Exporting the validator functions
module.exports = {
  postContentValidator,
  postTypeValidator,
  imagesValidator,
  upvotesCountValidator,
  downvotesCountValidator,
  commentContentValidator,
  usernameValidator,
};
