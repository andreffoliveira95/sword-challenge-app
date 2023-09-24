const mapToDTO = (user) => {
  return {
    userID: user.user_id,
    username: user.username,
    roleName: user.role_name,
    createdAt: user.created_at,
    lastUpdatedAt: user.updated_at
  };
};

module.exports = { mapToDTO };
