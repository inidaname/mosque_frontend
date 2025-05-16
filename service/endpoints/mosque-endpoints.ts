import { apiSlice } from "../apiSlice";

const mosqueEndpoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMosque: builder.mutation<object, MosInput>({
      query: (body) => ({
        url: "/mosque",
        method: "POST",
        body,
      }),
      invalidatesTags: ["mosques"],
    }),
    getMosqueList: builder.query<object, void>({
      query: () => ({
        url: "/mosque",
        method: "GET",
      }),
      providesTags: ["mosques"],
    }),
    updateMosque: builder.mutation<object, { id: string } & MosInput>({
      query: ({ id, ...body }) => ({
        url: `/mosque/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["mosque", "mosques"],
    }),
    getMosqueById: builder.query<object, string>({
      query: (id) => ({
        url: `/mosque/${id}`,
        method: "GET",
      }),
      providesTags: ["mosque", "mosques"],
    }),
  }),
});

export const {
  useCreateMosqueMutation,
  useGetMosqueByIdQuery,
  useGetMosqueListQuery,
  useLazyGetMosqueByIdQuery,
  useLazyGetMosqueListQuery,
  useUpdateMosqueMutation,
} = mosqueEndpoint;

interface MosInput {
  name: string;
  address: string;
  eid_time: string;
  jummah_time: string;
  lat: number;
  lng: number;
}
