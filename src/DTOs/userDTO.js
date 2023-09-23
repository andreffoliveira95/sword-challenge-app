const mapToDTO = user => {
  delete user.user_id;
  delete user.email;
  delete user.password;
  delete user.role_id;

  return user;
};

module.exports = { mapToDTO };
