import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './reducers/profile'
import storiesReducer from './reducers/stories'
import charactersReducer from './reducers/characters'
import locationsReducer from './reducers/locations'
import usersReducer from './reducers/users'

const store = configureStore({
  reducer: {
    users: usersReducer,
  }
})

export default store