export interface IData {
  [key: string]: any;
}

export interface IHeaderData {
  [key: string]: any;
}

export type Data = string | IData | FormData;
export type TransformRequest = (data: Data, headers?: IHeaderData) => Data;
export type TransformResponse = (data: Data) => Data;

export interface IConfig {
  headers?: IHeaderData;
  params?: {
    [key: string]: string | number | boolean;
  };
  timeout?: number;
  withCredentials?: boolean;
  auth?: {
    username: string;
    password: string;
  };

  validateStatus?: Function;
  paramsSerializer?: Function;
  transformRequest?: Array<TransformRequest>;
  transformResponse?: Array<TransformResponse>;
  redirect?: RequestRedirect;
  responseType?: ResponseType;
}

export interface IRequest extends IConfig {
  url?: string;
  baseURL?: string;
  method?:
    | string
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'options'
    | 'head'
    | 'connect'
    | 'trace'
    | 'patch';
  data?: Data;
}

export interface IAxiodResponse<T = any> {
  status: number;
  statusText: string;
  data: T;
  headers: Headers;
  config: IRequest;
}

export interface IAxiodError<T = unknown> {
  response: {
    status: number;
    statusText: string;
    data: T;
    headers: Headers;
  };
  config: IRequest;
}

export type IAxiodRequestInterceptor = (config: IRequest) => IRequest | Promise<IRequest>;
export type IAxiodRequestErrorInterceptor = (error: IAxiodError) => Promise<never>;

export type IAxiodResponseInterceptor<T = any> = (response: IAxiodResponse<T>) => IAxiodResponse<T>;
export type IAxiodResponseErrorInterceptor = (error: IAxiodError) => Promise<never>;

export interface IAxiodInterceptor<Fullfill = any, Rejected = any> {
  list: Array<
    {
      fulfilled?: Fullfill | null;
      rejected?: Rejected | null;
    } | null
  >;
  use: (fulfilled?: Fullfill | null | undefined, rejected?: Rejected | null | undefined) => number;
  eject: (index: number) => void;
}
export interface IAxiodInterceptors {
  request: IAxiodInterceptor<IAxiodRequestInterceptor, IAxiodRequestErrorInterceptor>;
  response: IAxiodInterceptor<IAxiodResponseInterceptor, IAxiodResponseErrorInterceptor>;
}

export type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text' | 'stream';
