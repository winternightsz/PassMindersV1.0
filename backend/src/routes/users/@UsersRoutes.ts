import { app } from '../../server'
import { CreateUser } from './create-user'
import { FindAllUsers } from './find-all-users'
import { AuthUser } from './auth-user'

export const UsersRoutes = async () =>{
    app.register(FindAllUsers)
    app.register(CreateUser)
    app.register(AuthUser)
}