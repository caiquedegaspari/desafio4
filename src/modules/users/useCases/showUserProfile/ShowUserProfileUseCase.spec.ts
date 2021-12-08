import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe('Show user Profile', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
  })
  it('Should be able to show user profile', async () => {
    const user = await usersRepositoryInMemory.create({
      email: 'teste@email.com',
      name: 'test',
      password: 'test'
    })
    const profile = await showUserProfileUseCase.execute(user.id)
    expect(profile.name).toEqual(user.name)
  })
  it('Should not be able to show user profile if user does not exists', () => {
    expect(async () => {
      await showUserProfileUseCase.execute('1234')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})