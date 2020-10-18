import { gql, QueryHookOptions, useApolloClient } from "@apollo/client";
import { createMutationHook, createQueryHook } from "../lib/createApolloHook";

// QUERY/I_USER
export const I_USER = gql`
  query IUser {
    iUser {
      name
      email
      id
    }
  }
`
interface IUserData {
  iUser: {
    name: string
    email: string
  }
}
interface IUserVars {

}
export const useIUser = (options?: QueryHookOptions) => createQueryHook<IUserData, IUserVars>(I_USER, {
  ...options
})

// MUTATION/LOGIN
const LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
        email
        name
    }
  }
`
interface LoginData {
  userLogin: {
    email: string
    name: string
    id: number
  }
}
interface LoginVars {
  email: string
  password: string
}
export const useLogin = () => createMutationHook<LoginData, LoginVars>(LOGIN, {
  errorPolicy: 'all'
})

// MUTATION/LOGOUT
const LOGOUT = gql`
  mutation {
    userLogout {
      name
    }
  }
`
interface LogoutData {
  userLogout: null
}
interface LogoutVars {

}
export const useLogout = () => createMutationHook<LogoutData, LogoutVars>(LOGOUT, {

})