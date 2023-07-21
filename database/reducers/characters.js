import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCharacter as getC, getCharacterComments as getCC, submitCharacterFeedback as submitCF, deleteCharacterComment, addCharacterToFavorite, getUserCharacters, getFavoriteCharacters, addCharacter, editCharacter, deleteCharacter, getAllCharacters } from '../actions/characters'
import { rateComment } from '../actions/profile'

export const charactersAPI = createApi({
  reducerPath: 'charactersAPI',
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    getCharacter: builder.query({
      async queryFn(data) {
        return getC(data.id, null, data.type)
      },
      invalidatesTags: ["Comments"]
    }),
    addCharacter: builder.mutation({
      async queryFn(data) {
        return addCharacter(data)
      },
      invalidatesTags: ["Comments"]
    }),
    editCharacter: builder.mutation({
      async queryFn(data) {
        return editCharacter(data.id, data.data)
      }
    }),
    deleteCharacter: builder.mutation({
      async queryFn(id) {
        return deleteCharacter(id)
      }
    }),
    getAllCharacters: builder.query({
      async queryFn() {
        return getAllCharacters()
      }
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
    }),
    rateComment: builder.mutation({
      async queryFn(data) {
        return rateComment(data.commentId, data.type)
      },
      invalidatesTags: ["Comments"]
    }),
    addToFavorites: builder.mutation({
      async queryFn(data) {
        return addCharacterToFavorite(data.id, data.username, data.userImage, data.characterName)
      },
      invalidatesTags: ["Comments"]
    }),
    getUserCharacters: builder.query({
      async queryFn(data) {
        return getUserCharacters(data.id, data.type)
      }
    }),
    getFavoriteCharacters: builder.query({
      async queryFn(id) {
        return getFavoriteCharacters(id)
      }
    })
  })
})

export const { useGetCharacterQuery, useGetCharacterCommentsQuery, useSubmitCharacterFeedbackMutation, useDeleteCharacterCommentMutation, useRateCommentMutation, useAddToFavoritesMutation, useGetUserCharactersQuery, useGetFavoriteCharactersQuery, useAddCharacterMutation, useEditCharacterMutation, useDeleteCharacterMutation, useGetAllCharactersQuery } = charactersAPI