import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository


describe('Teste', () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it('Should be able to create a user', async () => {
    const user = await createUserUseCase.execute({
      name: 'test',
      email: 'test@email.com',
      password: 'testpassword'
    })
    expect(user).toHaveProperty('id')
  })
  it('Should not be able to create user if user already exists', () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'test',
        email: 'test@email.com',
        password: 'testpassword'
      })
      await createUserUseCase.execute({
        name: 'test',
        email: 'test@email.com',
        password: 'testpassword'
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})