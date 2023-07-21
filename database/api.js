import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCharacter as getC, getCharacterComments as getCC, submitCharacterFeedback as submitCF, deleteCharacterComment } from './actions/characters'

export const charactersAPI = createApi({
  reducerPath: 'charactersAPI',
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    getCharacter: builder.query({
      async queryFn(id, type) {
        return getC(id, "show")
      },
      invalidatesTags: ["Comments"]
    }),
    getCharacterComments: builder.query({
      async queryFn(data) {
        return getCC(data.id, data.type)
      },
      providesTags: ["Comments"]
    }),
    submitCharacterFeedback: builder.mutation({
      async queryFn(info) {
        return submitCF(info.info, info.userComment)
      },
      invalidatesTags: ["Comments"]
    }),
    deleteCharacterComment: builder.mutation({
      async queryFn(id) {
        return deleteCharacterComment(id)
      },
      invalidatesTags: ["Comments"]
    })
  })
})

export const { useGetCharacterQuery, useGetCharacterCommentsQuery, useSubmitCharacterFeedbackMutation, useDeleteCharacterCommentMutation } = charactersAPI