import { app } from '..//server'
import { AccountsRoutes } from './accounts/@AccountsRoutes'
import { FoldersRoutes } from './folders/@FoldersRoutes'
import { UsersRoutes } from './users/@UsersRoutes'

export const routes = async () => {
    app.register(UsersRoutes)
    app.register(AccountsRoutes)
    app.register(FoldersRoutes)
}