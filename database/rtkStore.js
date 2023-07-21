import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { charactersAPI } from './reducers/characters';
import { profileAPI } from './reducers/profile';
import { storiesAPI } from './reducers/stories';
import { locationsAPI } from './reducers/locations';

export const store = configureStore({
  reducer: {
    [charactersAPI.reducerPath]: charactersAPI.reducer,
    [profileAPI.reducerPath]: profileAPI.reducer,
    [storiesAPI.reducerPath]: storiesAPI.reducer,
    [locationsAPI.reducerPath]: locationsAPI.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    charactersAPI.middleware,
    profileAPI.middleware,
    storiesAPI.middleware,
    locationsAPI.middleware
  ])
})

setupListeners(store.dispatch);

export const wrapper = (getServerSidePropsFunc) => async (context) => {

  const { store: contextStore } = context;

  await contextStore.dispatch(charactersAPI.endpoints.getData.initiate());
  await contextStore.dispatch(profileAPI.endpoints.getData.initiate());
  await contextStore.dispatch(storiesAPI.endpoints.getData.initiate());
  await contextStore.dispatch(locationsAPI.endpoints.getData.initiate());

  const characters = contextStore.getState().charactersAPI.entities.data;
  const profile = contextStore.getState().profileAPI.entities.data;
  const stories = contextStore.getState().storiesAPI.entities.data;
  const locations = contextStore.getState().locationsAPI.entities.data;

  return getServerSidePropsFunc({
    ...context,
    characters,
    profile,
    stories,
    locations,
  });
};

// CHECK IF USER IS AUTHORIZED BEFORE GETTING DOCS
// CHECK IF ITEM EXISTS FOR LIKEDBY AND RELATIVES