// Validate each and every property of the user object

/** Validator function for username */
function usernameValidator(username) {
    // Check for string
    if (typeof username !== "string") {
        return false;
    }
    // Check for length
    if (username.length < 6 || username.length > 255) {
        return false;
    }
    return true;
}

/** Validator function for email */
function emailValidator(email) {
    // Check for string
    if (typeof email !== "string") {
        return false;
    }
    // Check for length
    if (email.length < 6 || email.length > 255) {
        return false;
    }
    // Check for email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return false;
    }
    return true;
}

/** Validator function for password */
function passwordValidator(password) {
    // Check for string
    if (typeof password !== "string") {
        return false;
    }
    // Check for length
    if (password.length < 6 || password.length > 255) {
        return false;
    }
    return true;
}


module.exports = {
    usernameValidator,
    emailValidator,
    passwordValidator,
};
