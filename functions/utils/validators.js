const isEmpty = (str) => {
  if (str.trim() === "") return true;
  else return false;
};

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const validateWebsites = (data) => {
  if (isEmpty(data)) return data;
  if (data.trim().substring(0, 4) !== "http") {
    return `http://${data.trim()}`;
  } else return data;
};

exports.validateSignUpData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  if (isEmpty(data.username)) {
    errors.username = "Must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.biography.trim())) userDetails.biography = data.biography;

  userDetails.twitter = validateWebsites(data.twitter);
  userDetails.instagram = validateWebsites(data.instagram);
  userDetails.facebook = validateWebsites(data.facebook);

  return userDetails;
};

exports.isPostValid = (data) => {
  let errors = {};
  if (isEmpty(data.title)) errors.title = "Must not be empty";
  if (isEmpty(data.genre)) errors.genre = "Must not be empty";
  if (isEmpty(data.status)) errors.status = "Must not be empty";
  if (isEmpty(data.language)) errors.language = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.isLocationValid = (data) => {
  let errors = {};
  if (isEmpty(data.name)) errors.name = "Must not be empty";
  if (isEmpty(data.storyId)) errors.storyId = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.arr_diff = (a1, a2) => {
  let a = [],
    diff = [];

  for (let i = 0; i < a1.length; i++) {
    a[a1[i]] = true;
  }

  for (let i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]];
    } else {
      a[a2[i]] = true;
    }
  }

  for (let k in a) {
    diff.push(k);
  }

  return diff;
};