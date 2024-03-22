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
  
  // Validator for username
function usernameValidator(username) {
    // Trim leading and trailing spaces from the username
    const trimmedUsername = username.trim();
  
    // Check if the trimmed username is alphanumeric and has a length between 3 and 20 characters
    if (!isAlphaNumeric(trimmedUsername) || trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      return false;
    }
    return true;
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
  