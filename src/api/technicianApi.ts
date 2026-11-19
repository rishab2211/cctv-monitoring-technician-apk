/**
 * @file technicianApi.ts
 * @description RTK Query API client for Technician Mobile App
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiResponse, InstallationJob } from '../types';

export const technicianApi = createApi({
  reducerPath: 'technicianApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api-cctv-backend.duckdns.org/api/v1',
    prepareHeaders: (headers) => {
      // Token injection placeholder (reads from auth state)
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      return headers;
    },
  }),
  tagTypes: ['Jobs', 'JobDetail', 'CameraStatus'],
  endpoints: (builder) => ({
    getAssignedJobs: builder.query<ApiResponse<{ jobs: InstallationJob[] }>, void>({
      query: () => '/installations/assigned',
      providesTags: ['Jobs'],
    }),

    getJobDetail: builder.query<ApiResponse<{ job: InstallationJob }>, string>({
      query: (id) => `/installations/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'JobDetail', id }],
    }),

    updateChecklist: builder.mutation<
      ApiResponse<{ job: InstallationJob }>,
      { id: string; items: { id: string; completed: boolean; notes?: string }[] }
    >({
      query: ({ id, items }) => ({
        url: `/installations/${id}/checklist`,
        method: 'POST',
        body: { items },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'JobDetail', id }],
    }),

    uploadJobPhotos: builder.mutation<
      ApiResponse<{ job: InstallationJob }>,
      { id: string; photos: string[] }
    >({
      query: ({ id, photos }) => ({
        url: `/installations/${id}/photos`,
        method: 'POST',
        body: { photos },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'JobDetail', id }],
    }),

    submitJobSignature: builder.mutation<
      ApiResponse<{ job: InstallationJob }>,
      { id: string; signatureBase64: string }
    >({
      query: ({ id, signatureBase64 }) => ({
        url: `/installations/${id}/signature`,
        method: 'POST',
        body: { signature: signatureBase64 },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'JobDetail', id }, 'Jobs'],
    }),

    completeInstallationJob: builder.mutation<
      ApiResponse<{ job: InstallationJob }>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/installations/${id}/complete`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Jobs'],
    }),

    provisionGb28181Camera: builder.mutation<
      ApiResponse<any>,
      {
        name: string;
        serialNumber: string;
        brand: string;
        ip?: string;
        jobId?: string;
        streamMode?: 'gb28181';
      }
    >({
      query: (body) => ({
        url: '/cameras/provision',
        method: 'POST',
        body: { ...body, streamMode: 'gb28181' },
      }),
    }),

    getStreamStatus: builder.query<ApiResponse<any>, string>({
      query: (id) => `/cameras/${id}/stream-status`,
      providesTags: ['CameraStatus'],
    }),
  }),
});

export const {
  useGetAssignedJobsQuery,
  useGetJobDetailQuery,
  useUpdateChecklistMutation,
  useUploadJobPhotosMutation,
  useSubmitJobSignatureMutation,
  useCompleteInstallationJobMutation,
  useProvisionGb28181CameraMutation,
  useGetStreamStatusQuery,
} = technicianApi;
