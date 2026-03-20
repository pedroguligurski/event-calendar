export interface CreateUserDTO {
  name: string
  surname: string
  displayName?: string
  email: string
  dateOfBirth?: string
}

export interface CreateUserResponse {
  id: number
  name: string
  surname: string
  displayName: string | null
  email: string
  dateOfBirth: string | null
}

export type UserResponse = CreateUserResponse

export interface ListUsersResponse {
  users: UserResponse[]
}