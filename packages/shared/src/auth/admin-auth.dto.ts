export interface CreateAdminDTO {
  name: string
  email: string
  password: string
}

export interface AdminAuthResponse {
  token: string
  admin: {
    id: number
    name: string
    email: string
  }
}

export interface AdminLoginDTO {
  email: string
  password: string
}