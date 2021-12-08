import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe('Authenticate User', () => {

  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
  })

  it('Should be able to authenticate user', async () => {
    await createUserUseCase.execute({
      name: 'test',
      email: 'test@email.com',
      password: '123456'
    })
    const authentication = await authenticateUserUseCase.execute({
      email: 'test@email.com',
      password: '123456'
    })

    expect(authentication).toHaveProperty('token')
  })

  it('Should not be able to authenticate a non-existent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'nonExistent@email.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('Should not be able to authenticate a user with a wrong password', () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: 'wrong@email.com',
        name: 'wrong password',
        password: 'rightPassword'
      })

      await authenticateUserUseCase.execute({
        email: 'wrong@email.com',
        password: 'wrongPassword'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})