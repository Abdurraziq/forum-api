import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase.js'

export default class UsersHandler {
  #container

  constructor (container) {
    this.#container = container

    this.postUserHandler = this.postUserHandler.bind(this)
  }

  async postUserHandler (request, h) {
    const addUserUseCase = this.#container.getInstance(AddUserUseCase.name)
    const addedUser = await addUserUseCase.execute(request.payload)
    const response = h.response({
      status: 'success',
      data: {
        addedUser
      }
    })
    response.code(201)
    return response
  }
}
