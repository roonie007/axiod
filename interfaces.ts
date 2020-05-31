export interface IData {
  [key: string]: any;
}
export type Data = string | IData | FormData;

export interface IConfig {
  headers?: {
    [key: string]: string;
  };
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
  transformRequest?: Function;
  transformResponse?: Function;
}

export interface IRequest extends IConfig {
  url: string;
  baseURL?: string;
  method:
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

export interface IAxiodResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Headers;
  config: IRequest;
}
