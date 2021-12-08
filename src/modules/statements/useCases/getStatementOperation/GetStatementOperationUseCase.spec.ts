import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let getStatementOperationUseCase: GetStatementOperationUseCase
let statementsRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository

describe('Get Statement Operation', () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory, 
      statementsRepositoryInMemory
    )
  })

  it('Should be able to get a statement operation', async () => {
    const user = await usersRepositoryInMemory.create({
      email: 'email@teste.com',
      name: 'teste',
      password: '123456'
    })
    const statement = await statementsRepositoryInMemory.create({
      description: 'test statement',
      amount: 1200,
      type: OperationType.DEPOSIT,
      user_id: user.id
    })
    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id,
      user_id: user.id
    })
    expect(statementOperation).toHaveProperty('user_id')
  })

  it('Should not be able to get a statement operation of a non existent user', () => {
    expect( async () => {
      const statement = await statementsRepositoryInMemory.create({
        description: 'test statement',
        amount: 1200,
        type: OperationType.DEPOSIT,
        user_id: '12345'
      })
      await getStatementOperationUseCase.execute({
        statement_id: statement.id,
        user_id: '12345'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('Should not be able to get a statement operation of a non existent statement', () => {
    expect( async () => {
      const user = await usersRepositoryInMemory.create({
        email: 'email@teste.com',
        name: 'teste',
        password: '123456'
      })
    
      await getStatementOperationUseCase.execute({
        statement_id: '123456',
        user_id: user.id
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})