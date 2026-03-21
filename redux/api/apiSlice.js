import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/utils/axiosBaseQuery';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User', 'Course', 'Lesson', 'Enrollment', 'Quiz', 'Assignment', 'Review', 'Coupon', 'Category', 'Banner', 'Section', 'Page'],
  endpoints: (builder) => ({
    // Shared endpoints can go here, expanded later
    checkHealth: builder.query({
      query: () => ({ url: '/health', method: 'GET' }),
    }),
    getAdminUsers: builder.query({
      query: (params) => ({ 
        url: '/admin/users', 
        method: 'GET',
        params: {
          search: params?.search || '',
          role: params?.role || 'all',
          page: params?.page || 1,
          limit: params?.limit || 10
        }
      }),
      providesTags: ['User'],
    }),
    createAdminUser: builder.mutation({
      query: (data) => ({
        url: '/admin/users',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['User'],
    }),
    updateAdminUser: builder.mutation({
      query: ({ userId, ...data }) => ({
        url: `/admin/users/${userId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteAdminUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getAdminCourses: builder.query({
      query: () => ({ url: '/admin/courses', method: 'GET' }),
      providesTags: ['Course'],
    }),
    createAdminCourse: builder.mutation({
      query: (data) => ({
        url: '/admin/courses',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Course'],
    }),
    updateAdminCourse: builder.mutation({
      query: (data) => ({
        url: '/admin/courses',
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Course'],
    }),
    deleteAdminCourse: builder.mutation({
      query: (courseId) => ({
        url: `/admin/courses?courseId=${courseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),
    getAdminSettings: builder.query({
      query: () => ({ url: '/admin/settings', method: 'GET' }),
      providesTags: ['Setting'],
    }),
    updateAdminSettings: builder.mutation({
      query: (data) => ({
        url: '/admin/settings',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Setting'],
    }),
    getAdminInstructors: builder.query({
      query: (params) => ({
        url: '/admin/instructors',
        params: {
          search: params?.search || '',
          page: params?.page || 1,
          limit: params?.limit || 10
        }
      }),
      providesTags: ['User'],
    }),
    getInstructorStats: builder.query({
      query: (id) => ({ url: `/admin/instructors/${id}/stats` }),
    }),
    getInstructorCourses: builder.query({
      query: (id) => ({ url: `/admin/instructors/${id}/courses` }),
    }),
    getAdminDashboardStats: builder.query({
      query: () => ({ url: '/admin/dashboard' }),
      providesTags: ['User', 'Course', 'Enrollment', 'Payment'],
    }),
    adminLogout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getAdminCategories: builder.query({
      query: () => ({ url: '/admin/categories', method: 'GET' }),
      providesTags: ['Category'],
    }),
    createAdminCategory: builder.mutation({
      query: (data) => ({
        url: '/admin/categories',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateAdminCategory: builder.mutation({
      query: (data) => ({
        url: '/admin/categories',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteAdminCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/categories?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    getAdminBanners: builder.query({
      query: () => ({ url: '/admin/banners', method: 'GET' }),
      providesTags: ['Banner'],
    }),
    createAdminBanner: builder.mutation({
      query: (data) => ({
        url: '/admin/banners',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Banner'],
    }),
    updateAdminBanner: builder.mutation({
      query: (data) => ({
        url: '/admin/banners',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Banner'],
    }),
    deleteAdminBanner: builder.mutation({
      query: (id) => ({
        url: `/admin/banners?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),
    getAdminPages: builder.query({
      query: () => ({ url: '/admin/pages', method: 'GET' }),
      providesTags: ['Page'],
    }),
    createAdminPage: builder.mutation({
      query: (data) => ({
        url: '/admin/pages',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Page'],
    }),
    updateAdminPage: builder.mutation({
      query: (data) => ({
        url: '/admin/pages',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Page'],
    }),
    deleteAdminPage: builder.mutation({
      query: (id) => ({
        url: `/admin/pages?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Page'],
    }),
    getPublicPage: builder.query({
      query: (slug) => ({ url: `/pages/${slug}`, method: 'GET' }),
    }),
    getAdminCourseSections: builder.query({
      query: (courseId) => ({ url: `/admin/courses/${courseId}/sections`, method: 'GET' }),
      providesTags: ['Section'],
    }),
    createAdminCourseSection: builder.mutation({
      query: ({ courseId, ...data }) => ({
        url: `/admin/courses/${courseId}/sections`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Section'],
    }),
    updateAdminSection: builder.mutation({
      query: ({ courseId, sectionId, ...data }) => ({
        url: `/admin/courses/${courseId}/sections/${sectionId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Section'],
    }),
    deleteAdminSection: builder.mutation({
      query: ({ courseId, sectionId }) => ({
        url: `/admin/courses/${courseId}/sections/${sectionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Section'],
    }),
    reorderAdminCourseSections: builder.mutation({
      query: ({ courseId, elements }) => ({
        url: `/admin/courses/${courseId}/sections/reorder`,
        method: 'PUT',
        data: { elements },
      }),
      invalidatesTags: ['Section'],
    }),
    getCourseSections: builder.query({
      query: (courseId) => ({ url: `/instructor/courses/${courseId}/sections`, method: 'GET' }),
      providesTags: ['Section'],
    }),
    createCourseSection: builder.mutation({
      query: ({ courseId, ...data }) => ({
        url: `/instructor/courses/${courseId}/sections`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Section'],
    }),
    updateSection: builder.mutation({
      query: ({ courseId, sectionId, ...data }) => ({
        url: `/instructor/courses/${courseId}/sections/${sectionId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Section'],
    }),
    deleteSection: builder.mutation({
      query: ({ courseId, sectionId }) => ({
        url: `/instructor/courses/${courseId}/sections/${sectionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Section'],
    }),
    reorderCourseSections: builder.mutation({
      query: ({ courseId, elements }) => ({
        url: `/instructor/courses/${courseId}/sections/reorder`,
        method: 'PUT',
        data: { elements },
      }),
      invalidatesTags: ['Section'],
    }),
    getLessons: builder.query({
      query: (sectionId) => ({ url: `/sections/${sectionId}/lessons`, method: 'GET' }),
      providesTags: ['Lesson'],
    }),
    createLesson: builder.mutation({
      query: ({ sectionId, ...data }) => ({
        url: `/sections/${sectionId}/lessons`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Lesson', 'Section'],
    }),
    updateLesson: builder.mutation({
      query: ({ lessonId, ...data }) => ({
        url: `/lessons/${lessonId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Lesson', 'Section'],
    }),
    deleteLesson: builder.mutation({
      query: (lessonId) => ({
        url: `/lessons/${lessonId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lesson', 'Section'],
    }),

    // ── Student Learning Page ──────────────────────────────────────────────
    getLearningCourse: builder.query({
      query: (courseId) => ({ url: `/student/learn/${courseId}`, method: 'GET' }),
      providesTags: ['Enrollment', 'Course', 'Section', 'Lesson'],
    }),
    markLessonComplete: builder.mutation({
      query: ({ courseId, lessonId }) => ({
        url: '/student/progress',
        method: 'POST',
        data: { courseId, lessonId },
      }),
      invalidatesTags: ['Enrollment'],
    }),
    getVideoPlayUrl: builder.mutation({
      query: ({ lessonId, deviceId }) => ({
        url: '/videos/play',
        method: 'POST',
        data: { lessonId, deviceId },
      }),
    }),
    getCourseProgress: builder.query({
      query: (courseId) => ({ url: `/progress/${courseId}`, method: 'GET' }),
      providesTags: ['Enrollment'],
    }),
    markProgressComplete: builder.mutation({
      query: ({ courseId, lessonId }) => ({
        url: '/progress/mark-complete',
        method: 'POST',
        data: { courseId, lessonId },
      }),
      invalidatesTags: ['Enrollment'],
    }),
    updateLastLesson: builder.mutation({
      query: ({ courseId, lastLessonId }) => ({
        url: `/progress/${courseId}`,
        method: 'PATCH',
        data: { lastLessonId },
      }),
      invalidatesTags: ['Enrollment'],
    }),

    // ── Public Homepage Endpoints ──────────────────────────────────────────
    getCategories: builder.query({
      query: () => ({ url: '/categories', method: 'GET' }),
      providesTags: ['Category'],
    }),
    getCourses: builder.query({
      query: (params) => ({ 
        url: '/courses', 
        method: 'GET',
        params 
      }),
      providesTags: ['Course'],
    }),
    getInstructors: builder.query({
      query: () => ({ url: '/instructors', method: 'GET' }),
      providesTags: ['User'],
    }),
    getAnalyticsSummary: builder.query({
      query: () => ({ url: '/analytics/summary', method: 'GET' }),
    }),
    getReviews: builder.query({
      query: () => ({ url: '/reviews', method: 'GET' }),
      providesTags: ['Review'],
    }),
    getPublicSettings: builder.query({
      query: () => ({ url: '/settings', method: 'GET' }),
      providesTags: ['Setting'],
    }),
  }),
});

export const {
  useCheckHealthQuery,
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetAdminCoursesQuery,
  useCreateAdminCourseMutation,
  useUpdateAdminCourseMutation,
  useDeleteAdminCourseMutation,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  useGetAdminInstructorsQuery,
  useGetInstructorStatsQuery,
  useGetInstructorCoursesQuery,
  useGetAdminDashboardStatsQuery,
  useAdminLogoutMutation,
  useGetAdminCategoriesQuery,
  useCreateAdminCategoryMutation,
  useUpdateAdminCategoryMutation,
  useDeleteAdminCategoryMutation,
  useGetAdminBannersQuery,
  useCreateAdminBannerMutation,
  useUpdateAdminBannerMutation,
  useDeleteAdminBannerMutation,
  useGetAdminCourseSectionsQuery,
  useCreateAdminCourseSectionMutation,
  useUpdateAdminSectionMutation,
  useDeleteAdminSectionMutation,
  useReorderAdminCourseSectionsMutation,
  useGetCourseSectionsQuery,
  useCreateCourseSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useReorderCourseSectionsMutation,
  useGetLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetLearningCourseQuery,
  useMarkLessonCompleteMutation,
  useGetVideoPlayUrlMutation,
  useGetCourseProgressQuery,
  useMarkProgressCompleteMutation,
  useUpdateLastLessonMutation,
  // Public
  useGetCategoriesQuery,
  useGetCoursesQuery,
  useGetInstructorsQuery,
  useGetAnalyticsSummaryQuery,
  useGetReviewsQuery,
  useGetPublicSettingsQuery,
  useGetAdminPagesQuery,
  useCreateAdminPageMutation,
  useUpdateAdminPageMutation,
  useDeleteAdminPageMutation,
  useGetPublicPageQuery,
} = apiSlice;
