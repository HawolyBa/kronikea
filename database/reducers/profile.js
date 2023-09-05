// import { createSlice } from "@reduxjs/toolkit";

// const profileSlice = createSlice({
//   name: 'profile',
//   initialState: {
//     profile: {}
//   },
//   reducers: {
//     GET_PROFILE(state, action) {
//       state.profile = action.payload;
//     }
//   }
// })

// export const { GET_PROFILE } = profileSlice.actions;
// export default profileSlice.reducer;

import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { report, getUserInfo, getProfile, changeProfile, followUser, getForYouPage, sendMessage, sendFeedback } from '../actions/profile'

export const profileAPI = createApi({
  reducerPath: 'profileAPI',
  baseQuery: fakeBaseQuery(),
  tagTypes: ["profile"],
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      async queryFn(id) {
        return getUserInfo(id)
      },
      providesTags: ["profile"]
    }),
    changeProfile: builder.mutation({
      async queryFn(data) {
        return changeProfile(data.data, data.id)
      },
      invalidatesTags: ["profile"]
    }),
    report: builder.mutation({
      async queryFn(data) {
        return report(data)
      },
      invalidatesTags: ["profile"]
    }),
    getProfile: builder.query({
      async queryFn(data) {
        console.log(data)
        return getProfile(data.id, data.type, data.uid)
      },
      providesTags: ["profile"]
    }),
    followUser: builder.mutation({
      async queryFn(data) {
        return followUser(data.id, data.username, data.userImage)
      },
      invalidatesTags: ["profile"]
    }),
    getForYouPage: builder.query({
      async queryFn(data) {
        return getForYouPage(data)
      }
    }),
    sendMessage: builder.mutation({
      async queryFn(data) {
        return sendMessage(data)
      }
    }),
    sendFeedback: builder.mutation({
      async queryFn(data) {
        return sendFeedback(data)
      }
    })
  })
})

export const { useGetUserInfoQuery, useChangeProfileMutation, useReportMutation, useGetProfileQuery, useFollowUserMutation, useGetForYouPageQuery, useSendMessageMutation, useSendFeedbackMutation } = profileAPI