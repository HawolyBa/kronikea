// import { createSlice } from "@reduxjs/toolkit";

// const storiesSlice = createSlice({
//   name: 'stories',
//   initialState: {
//     story: {},
//     chapters: [],
//     stories: [],
//     favStories: [],
//     loading: true
//   },
//   reducers: {
//     IS_LOADING(state, action) {
//       state.loading = action.payload;
//     },
//     GET_STORY(state, action) {
//       state.story = action.payload;
//     },
//     GET_STORIES(state, action) {
//       state.stories = action.payload;
//       state.loading = false
//     },
//     GET_FAV_STORIES(state, action) {
//       state.favStories = action.payload;
//     },
//     GET_CHAPTERS(state, action) {
//       state.chapters = action.payload;
//     }
//   }
// })

// export const { GET_STORY, GET_STORIES, GET_FAV_STORIES, GET_CHAPTERS, IS_LOADING } = storiesSlice.actions;
// export default storiesSlice.reducer;

import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { getFavoriteStories, getStory, getUserStories, addStoryToFavorites, getChapter, getFeaturedStories, addStory, getStoryOnly, editStory, submitComment, getComments, getChapterInfo, addChapter, editChapter, deleteChapter, deleteStory, getAllStories, getPopularStories, getPopularStoriesByCategory, getStoriesByTag, subscribeToCategory } from '../actions/stories'
import { rateComment } from '../actions/profile'

export const storiesAPI = createApi({
  reducerPath: 'storiesAPI',
  baseQuery: fakeBaseQuery(),
  tagTypes: ["stories"],
  endpoints: (builder) => ({
    getStory: builder.query({
      async queryFn(id) {
        return getStory(id)
      }
    }),
    getStoryOnly: builder.query({
      async queryFn(id) {
        return await getStoryOnly(id)
      }
    }),
    addStory: builder.mutation({
      async queryFn(data) {
        return addStory(data)
      },
      invalidatesTags: ["stories"]
    }),
    editStory: builder.mutation({
      async queryFn(data) {
        return editStory(data.id, data.data)
      },
      invalidatesTags: ["stories"]
    }),
    deleteStory: builder.mutation({
      async queryFn(id) {
        return deleteStory(id)
      }
    }),
    getUserStories: builder.query({
      async queryFn(data) {
        return getUserStories(data.id, data.type, data.uid)
      },
    }),
    getFavoriteStories: builder.query({
      async queryFn(id) {
        return getFavoriteStories(id)
      }
    }),
    addStoryToFavorites: builder.mutation({
      async queryFn(data) {
        return addStoryToFavorites(data.id, data.username, data.userImage, data.storyTitle)
      },
      invalidatesTags: ["stories"]
    }),
    getChapter: builder.query({
      async queryFn(data) {
        return getChapter(data.id, data.storyId, data.type)
      }
    }),
    getChapterInfo: builder.query({
      async queryFn(data) {
        return getChapterInfo(data.storyId, data.type, data.chapterId)
      }
    }),
    addChapter: builder.mutation({
      async queryFn(data) {
        return addChapter(data)
      }
    }),
    editChapter: builder.mutation({
      async queryFn(data) {
        return editChapter(data.id, data.data)
      }
    }),
    deleteChapter: builder.mutation({
      async queryFn(id) {
        return deleteChapter(id)
      }
    }),
    getFeatured: builder.query({
      async queryFn() {
        return getFeaturedStories()
      },
      invalidatesTags: ["stories"]
    }),
    getPopularStories: builder.query({
      async queryFn() {
        return getPopularStories()
      }
    }),
    getPopularStoriesByCategory: builder.query({
      async queryFn(cat) {
        return getPopularStoriesByCategory(cat)
      }
    }),
    getComments: builder.query({
      async queryFn(data) {
        return getComments(data)
      },
      // async onCacheEntryAdded(data, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
      //   return getCommentsSnapshot(data, updateCachedData, cacheDataLoaded, cacheEntryRemoved)
      // },
      providesTags: ["stories"]
    }),
    submitComment: builder.mutation({
      async queryFn(data) {
        return submitComment(data)
      },
      invalidatesTags: ["stories"]
    }),
    rateComment: builder.mutation({
      async queryFn(data) {
        return rateComment(data.commentId, data.type)
      },
      invalidatesTags: ["stories"]
    }),
    getAllStories: builder.query({
      async queryFn() {
        return getAllStories()
      }
    }),
    getStoriesByTag: builder.query({
      async queryFn(tag) {
        return getStoriesByTag(tag)
      }
    }),
    subscribeToCategory: builder.mutation({
      async queryFn(data) {
        return subscribeToCategory(data)
      }
    })
  })
})

export const { useGetStoryQuery, useGetUserStoriesQuery, useGetFavoriteStoriesQuery, useAddStoryToFavoritesMutation, useGetChapterQuery, useGetFeaturedQuery, useAddStoryMutation, useGetStoryOnlyQuery, useEditStoryMutation, useSubmitCommentMutation, useGetCommentsQuery, useRateCommentMutation, useGetChapterInfoQuery, useAddChapterMutation, useEditChapterMutation, useDeleteChapterMutation, useDeleteStoryMutation, useGetAllStoriesQuery, useGetPopularStoriesByCategoryQuery, useGetPopularStoriesQuery, useGetStoriesByTagQuery, useSubscribeToCategoryMutation } = storiesAPI