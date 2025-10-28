import * as types from "@/@types/app-types.ts"


export const UserBodyExample: types.UserBodyType = {
    name: "Gabriel Gallan",
    age: 18,
    cpf: "54021528886",
    email: "admin@issivs.com",
    password: "929305"
}

export const UpdateUserBodyExample: types.UserUpdateBodyType = {
    auth: UserBodyExample.password,
    email: 'gabriel@issivs.com',
    password: '123456'
}