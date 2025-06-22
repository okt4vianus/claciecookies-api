export type Password = {
  hash: string;
  userId: string;
};

export type CreatePassword = Password;

export type UpdatePassword = Partial<Password>;

// Password hashes for dummy data
export const passwordHashes = [
  "$argon2id$v=19$m=65536,t=2,p=1$D5dYwwt4opZAvzyPjbtl7g$BU3O6GKBdXDnTQntepyXgI51NnfSrXgd939ErT4XLeI", // hashed "password123"
  "$argon2id$v=19$m=65536,t=2,p=1$uUfRjC1NEXFbIV6XekuFOg$YSf67cgkn35wjYmZwCzA2rVVrYhqRUIBVhIj90uCWd4", // hashed "securepass"
  "$argon2id$v=19$m=65536,t=2,p=1$j1yElxqrcZfCYU3spXyPoQ$loPxZQllHygwIo5k18Oa30E4x2YOGzTI049pB14xWko", // hashed "mypassword"
  "$argon2id$v=19$m=65536,t=2,p=1$2aCLvssmrtBtzpPkqVNHew$Wu8zAGDCywTFAUzxukyYXMm8jb8FV9vswkl9XuOqTTg", // hashed "userpass123"
  "$argon2id$v=19$m=65536,t=2,p=1$uPfBqCC5Kd1ciNhFpuwacg$Dr25ISbtIxIzvpPgf5w9WmA49sNY+bFWhrBC21jVgdM", // hashed "strongpass"
];

// Function to create password data with actual user IDs
export const createPasswordData = (userIds: string[]): CreatePassword[] => {
  return passwordHashes.map((hash, index) => ({
    hash,
    userId: userIds[index],
  }));
};
