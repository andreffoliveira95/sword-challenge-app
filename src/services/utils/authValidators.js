const isUsernameInUse = (usernameCount) => {
  return usernameCount[0].count !== 0;
};

const isEmailInUse = (emailCount) => {
  return emailCount[0].count !== 0;
};

const areAllInputsGiven = (username, email, password) => {
  return !username || !email || !password;
};

const isValidEmail = (email) => {
  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return emailPattern.test(email);
};

const areAllAuthInputsGiven = (email, password) => {
  return !email || !password;
};

const doesUserExist = (user) => {
  return user.length !== 0;
};

module.exports = {
  isUsernameInUse,
  isEmailInUse,
  areAllInputsGiven,
  isValidEmail,
  areAllAuthInputsGiven,
  doesUserExist
};
