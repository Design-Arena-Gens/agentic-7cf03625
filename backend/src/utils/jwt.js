import jwt from 'jsonwebtoken';

const EXPIRATION = '7d';

export function generateToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      roles: user.roles,
    },
    process.env.JWT_SECRET,
    { expiresIn: EXPIRATION }
  );
}
