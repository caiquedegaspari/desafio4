import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository

describe('Create Statement', () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory ,
      statementsRepositoryInMemory
    )
  })

  it('Should be able to create a statement', async () => {
    
    const user = await usersRepositoryInMemory.create({
      email: 'teste@email.com',
      name: 'name',
      password: '123456'
    })

    const statement = await createStatementUseCase.execute({
      amount: 1000,
      description: 'test description',
      type: OperationType.DEPOSIT,
      user_id: user.id
    })
    expect(statement).toHaveProperty('id')
  })

  it('Should not be able to create a statement if user does not exists', () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 1000,
        description: 'test description',
        type: OperationType.DEPOSIT,
        user_id: 'noUser'
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('Should not be able to create a statement if there is not enough money to withdraw', () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        email: 'teste@email.com',
        name: 'name',
        password: '123456'
      })

      await createStatementUseCase.execute({
        amount: 100,
        description: 'test description',
        type: OperationType.WITHDRAW,
        user_id: user.id
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})