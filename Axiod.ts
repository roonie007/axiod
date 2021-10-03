import { urlJoin } from "url-join";

import type { IRequest, IConfig, Data, IAxiodResponse } from "./interfaces.ts";
import { methods } from "./helpers.ts";

function axiod(config: IRequest): Promise<IAxiodResponse> {
  return axiod.request(config);
}

axiod.defaults = {
  url: "/",
  method: "get",
  timeout: 0,
  withCredentials: false,
};

axiod.create = (config: IRequest) => {
  const instance = axiod.bind(config);
  instance.defaults = Object.assign({}, axiod.defaults, config);
  return instance;
};

axiod.request = ({
  url = "/",
  baseURL,
  method = "get",
  headers,
  params,
  data,
  timeout = 0,
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

  // Create fetch Request Config
  const fetchRequestObject: RequestInit = {};

  // Add method to Request Config
  if (method !== "get") {
    fetchRequestObject.method = method.toUpperCase();
  }

  // Add params to Request Config Url
  if (_params) {
    url = urlJoin(url, `?${params}`);
  }

  // Add body to Request Config
  if (data && method !== "get") {
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

  // Add headers to Request Config
  if (headers) {
    const _headers: Headers = new Headers();
    Object.keys(headers).forEach((header) => {
      if (headers && headers[header]) {
        _headers.set(header, headers[header]);
      }
    });
    fetchRequestObject.headers = _headers;
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

axiod.get = (url: string, config?: IConfig) => {
  return axiod.request(Object.assign({}, { url }, config, { method: "get" }));
};
axiod.post = (url: string, data?: Data, config?: IConfig) => {
  return axiod.request(
    Object.assign({}, { url }, config, { method: "post", data })
  );
};
axiod.put = (url: string, data?: Data, config?: IConfig) => {
  return axiod.request(
    Object.assign({}, { url }, config, { method: "put", data })
  );
};
axiod.delete = (url: string, data?: Data, config?: IConfig) => {
  return axiod.request(
    Object.assign({}, { url }, config, { method: "delete", data })
  );
};
axiod.options = (url: string, data?: Data, config?: IConfig) => {
  return axiod.request(
    Object.assign({}, { url }, config, { method: "options", data })
  );
};
axiod.head = (url: string, data?: Data, config?: IConfig) => {
  return axiod.request(
    Object.assign({}, { url }, config, { method: "head", data })
  );
};
axiod.connect = (url: string, data?: Data, config?: IConfig) => {
  return axiod.request(
    Object.assign({}, { url }, config, { method: "connect", data })
  );
};
axiod.trace = (url: string, data?: Data, config?: IConfig) => {
  return axiod.request(
    Object.assign({}, { url }, config, { method: "trace", data })
  );
};
axiod.patch = (url: string, data?: Data, config?: IConfig) => {
  return axiod.request(
    Object.assign({}, { url }, config, { method: "patch", data })
  );
};

export default axiod;
