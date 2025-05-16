// type RootState = import("@store/store").IRootState;
// type AppDispatch = import("@/store/store").justDispatch;
// type DispatchFunc = () => AppDispatch;

type IReAuth = import("@reduxjs/toolkit/query").BaseQueryFn<
  string | import("@reduxjs/toolkit/query").FetchArgs,
  unknown,
  import("@reduxjs/toolkit/query").FetchBaseQueryError
>;

type AxiosBaseQueryType = import("@reduxjs/toolkit/query").BaseQueryFn<
  {
    url: string;
    method?: import("axios").AxiosRequestConfig["method"];
    data?: object;
  },
  unknown,
  { status: number; data: object }
>;

interface AuthState {
  user: UserModel | null;
  token: string | null;
}
