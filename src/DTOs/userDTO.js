function mapToDTO(user) {
  delete user.email;
  delete user.password;
  delete user.role_id;
  delete user.created_at;
  delete user.updated_at;

  return user;
}

module.exports = { mapToDTO };
