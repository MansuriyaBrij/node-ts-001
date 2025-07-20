export const UserResource = (user: any) => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    // Add more fields as needed
  };
};

export const UserResourceList = (users: any[]) => {
  return users.map(user => UserResource(user));
};