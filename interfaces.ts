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
}

export interface IRequest extends IConfig {
  url?: string;
  baseURL?: string;
  method?:
    | string
    | "get"
    | "post"
    | "put"
    | "delete"
    | "options"
    | "head"
    | "connect"
    | "trace"
    | "patch";
  data?: Data;
}

export interface IAxiodResponse<T = any> {
  status: number;
  statusText: string;
  data: T;
  headers: Headers;
  config: IRequest;
}
