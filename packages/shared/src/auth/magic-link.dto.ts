export interface SendMagicLinkDTO {
  email: string
}

export interface SendMagicLinkResponse {
  message: string
  magicLink?: string
}

export interface VerifyMagicLinkQueryDTO {
  token: string
}

export interface AuthUserResponse {
  id: number
  name: string
  surname: string
  displayName: string | null
  email: string
}

export interface VerifyMagicLinkResponse {
  token: string
  user: AuthUserResponse
}
