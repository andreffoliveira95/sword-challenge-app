const isUsernameInUse = (usernameCount) => {
  return usernameCount !== 0;
};

const isEmailInUse = (emailCount) => {
  return emailCount !== 0;
};

const areAllInputsGiven = (username, email, password, roleID) => {
  return (
    username !== ''
    && email !== ''
    && password !== ''
    && (roleID === '1' || roleID === '2')
  );
};

const areAllAuthInputsGiven = (email, password) => {
  return email !== '' && password !== '';
};

const isValidEmail = (email) => {
  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/g;
  return emailPattern.test(email);
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
