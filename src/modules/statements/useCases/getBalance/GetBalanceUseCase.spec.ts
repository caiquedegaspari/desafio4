import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase
let statementsRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository


describe('Get Balance', () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory, 
      usersRepositoryInMemory
    )
  })

  it('Should get user balance', async () => {
    const user = await usersRepositoryInMemory.create({
      email: 'email@teste.com',
      name: 'teste',
      password: '123456'
    })
    const balance = await getBalanceUseCase.execute({user_id: user.id})
    expect(balance).toHaveProperty('balance')
  })

  it('Should not be able to get user balance if user does not exists', () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: 'no existent user id'
        })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})