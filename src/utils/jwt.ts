import jwt from 'jsonwebtoken'

export const generateJWT = (id: string) : string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
  return token
}

export const decodeJWT = (token: string) : string | jwt.JwtPayload => {
  return jwt.verify(token,process.env.JWT_SECRET)
}