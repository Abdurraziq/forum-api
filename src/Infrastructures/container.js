/* istanbul ignore file */

import { createContainer } from 'instances-container'

// external agency
import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'
import Jwt from '@hapi/jwt'
import pool from './database/postgres/pool.js'

// service (repository, helper, manager, etc)
import AuthenticationRepository from '../Domains/authentications/AuthenticationRepository.js'
import CommentRepository from '../Domains/comments/CommentRepository.js'
import ReplyRepository from '../Domains/replies/ReplyRepository.js'
import UserRepository from '../Domains/users/UserRepository.js'
import ThreadRepository from '../Domains/threads/ThreadRepository.js'

import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres.js'
import CommentRepositoryPostgres from './repository/CommentRepositoryPostgres.js'
import ReplyRepositoryPostgres from './repository/ReplyRepositoryPostgres.js'
import ThreadRepositoryPostgres from './repository/ThreadRepositoryPostgres.js'
import UserRepositoryPostgres from './repository/UserRepositoryPostgres.js'

import AuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager.js'
import BcryptPasswordHash from './security/BcryptPasswordHash.js'
import JwtTokenManager from './security/JwtTokenManager.js'
import PasswordHash from '../Applications/security/PasswordHash.js'

// use case
import AddUserUseCase from '../Applications/use_case/AddUserUseCase.js'
import LogoutUserUseCase from '../Applications/use_case/LogoutUserUseCase.js'
import LoginUserUseCase from '../Applications/use_case/LoginUserUseCase.js'
import RefreshAuthenticationUseCase from '../Applications/use_case/RefreshAuthenticationUseCase.js'
import AddCommentUseCase from '../Applications/use_case/AddCommentUseCase.js'
import AddReplyUseCase from '../Applications/use_case/AddReplyUseCase.js'
import AddThreadUseCase from '../Applications/use_case/AddThreadUseCase.js'
import DeleteCommentUseCase from '../Applications/use_case/DeleteCommentUseCase.js'
import DeleteReplyUseCase from '../Applications/use_case/DeleteReplyUseCase.js'
import GetThreadUseCase from '../Applications/use_case/GetThreadUseCase.js'

// creating container
const container = createContainer()

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  }
])

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        }
      ]
    }
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name
        }
      ]
    }
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        }
      ]
    }
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'replyRepository',
          internal: ReplyRepository.name
        }
      ]
    }
  },
  {
    key: GetThreadUseCase.name,
    Class: GetThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name
        }
      ]
    }
  }
])

export default container