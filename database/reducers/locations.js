// import { createSlice } from "@reduxjs/toolkit";

// const locationsSlice = createSlice({
//   name: 'locations',
//   initialState: {
//     locations: [],
//     loading: true,
//     storyLocations: []
//   },
//   reducers: {
//     GET_LOCATIONS(state, action) {
//       state.locations = action.payload;
//       state.loading = false
//     },
//     GET_STORY_LOCATIONS(state, action) {
//       state.storyLocations = action.payload;
//     }
//   }
// })

// export const { GET_STORY_LOCATIONS, GET_LOCATIONS } = locationsSlice.actions;
// export default locationsSlice.reducer;
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { addLocation, getLocation, getUserLocations, editLocation, deleteLocation } from '../actions/locations'

export const locationsAPI = createApi({
  reducerPath: 'locationsAPI',
  baseQuery: fakeBaseQuery(),
  tagTypes: ["locations"],
  endpoints: (builder) => ({
    getLocation: builder.query({
      async queryFn(id) {
        return getLocation(id)
      }
    }),
    addLocation: builder.mutation({
      async queryFn(data) {
        return addLocation(data)
      }
    }),
    editLocation: builder.mutation({
      async queryFn(data) {
        return editLocation(data.id, data.data)
      }
    }),
    deleteLocation: builder.mutation({
      async queryFn(id) {
        return deleteLocation(id)
      }
    }),
    getUserLocations: builder.query({
      async queryFn(id) {
        return getUserLocations(id)
      }
    })
  })
})

export const { useGetUserLocationsQuery, useAddLocationMutation, useGetLocationQuery, useEditLocationMutation, useDeleteLocationMutation } = locationsAPI