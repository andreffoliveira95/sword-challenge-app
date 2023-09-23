const mapToDTO = (user) => {
  return {
    username: user.username,
    roleName: user.role_name,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
};

module.exports = { mapToDTO };
