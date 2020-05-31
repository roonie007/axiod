import { urlJoin } from "https://deno.land/x/url_join/mod.ts";

const methods = [
  "get",
  "post",
  "put",
  "delete",
  "options",
  "head",
  "connect",
  "trace",
  "patch",
];

interface IData {
  [key: string]: any;
}
type Data = string | IData | FormData;

interface IConfig {
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

  paramsSerializer?: Function;
}

interface IRequest extends IConfig {
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

const request = ({
  url = "/",
  baseURL,
  method = "get",
  headers,
  params,
  data,
  timeout = 1000,
  withCredentials = false,
  auth,
  paramsSerializer,
}: IRequest) => {
  // Url and Base url
  if (baseURL) {
    url = urlJoin(baseURL, url);
  }

  // Method
  if (methods.indexOf(method.toLowerCase().trim()) === -1) {
    throw new Error(`Method ${method} is not supported`);
  } else {
    method = method.toLowerCase().trim();
  }

  // Params
  let _params = "";
  if (params) {
    if (paramsSerializer) {
      _params = paramsSerializer(params);
    } else {
      _params = Object.keys(params)
        .map((key) => {
          return (
            encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
          );
        })
        .join("&");
    }
  }

  // Add credentials to header
  if (withCredentials) {
    if (auth?.username && auth?.password) {
      if (!headers) {
        headers = {};
      }

      headers["Authorization"] =
        "Basic " +
        btoa(unescape(encodeURIComponent(`${auth.username}:${auth.password}`)));
    }
  }

  const fetchRequestObject: RequestInit = {};

  if (method !== "get") {
    fetchRequestObject.method = method.toUpperCase();
  }

  if (_params) {
    url = urlJoin(url, `?${params}`);
  }
  if (data) {
    if (typeof data === "string" || data instanceof FormData) {
      fetchRequestObject.body = data;
    } else {
      try {
        fetchRequestObject.body = JSON.stringify(data);
        if (!headers) {
          headers = {};
        }

        headers["Accept"] = "application/json";
        headers["Content-Type"] = "application/json";
      } catch (ex) {}
    }
  }

  if (headers) {
    const _headers: Headers = new Headers();
    Object.keys(headers).forEach((header) => {
      if (headers && headers[header]) {
        _headers.set(header, headers[header]);
      }
    });
    fetchRequestObject.headers = _headers;
  }

  if (method !== "get" && data) {
    fetchRequestObject.body = JSON.stringify(data);
  }

  return fetch(url, fetchRequestObject).then(async (x) => {
    const _status: number = x.status;
    const _statusText: string = x.statusText;
    let _data: any = null;
    const contentType = x.headers.get("content-type") || "";
    if (contentType.toLowerCase().indexOf("json") === -1) {
      // Try to convert to json
      try {
        _data = await x.json();
      } catch (ex) {
        _data = await x.text();
      }
    } else {
      _data = await x.json();
    }
    const _headers: Headers = x.headers;
    const _config: IRequest = {
      url,
      baseURL,
      method,
      headers,
      params,
      data,
      timeout,
      withCredentials,
      auth,
      paramsSerializer,
    };

    if (_status >= 200 && _status < 300) {
      return Promise.resolve({
        status: _status,
        statusText: _statusText,
        data: _data,
        headers: _headers,
        config: _config,
      });
    } else {
      const error = {
        response: {
          status: _status,
          statusText: _statusText,
          data: _data,
          headers: _headers,
        },
        config: _config,
      };

      return Promise.reject(error);
    }
  });
};

const axiod = {
  request,
  get: (url: string, config?: IConfig) => {
    return request(Object.assign({}, { url }, config, { method: "get" }));
  },
  post: (url: string, data?: Data, config?: IConfig) => {
    return request(
      Object.assign({}, { url }, config, { method: "post", data })
    );
  },
  put: (url: string, data?: Data, config?: IConfig) => {
    return request(Object.assign({}, { url }, config, { method: "put", data }));
  },
  delete: (url: string, data?: Data, config?: IConfig) => {
    return request(
      Object.assign({}, { url }, config, { method: "delete", data })
    );
  },
  options: (url: string, data?: Data, config?: IConfig) => {
    return request(
      Object.assign({}, { url }, config, { method: "options", data })
    );
  },
  head: (url: string, data?: Data, config?: IConfig) => {
    return request(
      Object.assign({}, { url }, config, { method: "head", data })
    );
  },
  connect: (url: string, data?: Data, config?: IConfig) => {
    return request(
      Object.assign({}, { url }, config, { method: "connect", data })
    );
  },
  trace: (url: string, data?: Data, config?: IConfig) => {
    return request(
      Object.assign({}, { url }, config, { method: "trace", data })
    );
  },
  patch: (url: string, data?: Data, config?: IConfig) => {
    return request(
      Object.assign({}, { url }, config, { method: "patch", data })
    );
  },
  create: (config?: IRequest) => {
    const globalConfig = config;
    return {
      request,
      get: (url: string, config?: IConfig) => {
        return request(
          Object.assign({}, { url }, config, globalConfig, { method: "get" })
        );
      },
      post: (url: string, data?: Data, config?: IConfig) => {
        return request(
          Object.assign({}, { url }, config, globalConfig, {
            method: "post",
            data,
          })
        );
      },
      put: (url: string, data?: Data, config?: IConfig) => {
        return request(
          Object.assign({}, { url }, config, globalConfig, {
            method: "put",
            data,
          })
        );
      },
      delete: (url: string, data?: Data, config?: IConfig) => {
        return request(
          Object.assign({}, { url }, config, globalConfig, {
            method: "delete",
            data,
          })
        );
      },
      options: (url: string, data?: Data, config?: IConfig) => {
        return request(
          Object.assign({}, { url }, config, globalConfig, {
            method: "options",
            data,
          })
        );
      },
      head: (url: string, data?: Data, config?: IConfig) => {
        return request(
          Object.assign({}, { url }, config, globalConfig, {
            method: "head",
            data,
          })
        );
      },
      connect: (url: string, data?: Data, config?: IConfig) => {
        return request(
          Object.assign({}, { url }, config, globalConfig, {
            method: "connect",
            data,
          })
        );
      },
      trace: (url: string, data?: Data, config?: IConfig) => {
        return request(
          Object.assign({}, { url }, config, globalConfig, {
            method: "trace",
            data,
          })
        );
      },
      patch: (url: string, data?: Data, config?: IConfig) => {
        return request(
          Object.assign({}, { url }, config, globalConfig, {
            method: "patch",
            data,
          })
        );
      },
    };
  },
};

export default axiod;
