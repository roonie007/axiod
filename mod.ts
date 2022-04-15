import { urlJoin } from './mods/url-join.ts';

import type {
  Data,
  IAxiodError,
  IAxiodRequestErrorInterceptor,
  IAxiodRequestInterceptor,
  IAxiodResponse,
  IAxiodResponseErrorInterceptor,
  IAxiodResponseInterceptor,
  IConfig,
  IRequest,
} from './interfaces.ts';
import { addInterceptor, methods } from './helpers.ts';

function axiod<T = any>(
  url: string | IRequest,
  config?: IRequest,
): Promise<IAxiodResponse<T>> {
  if (typeof url === 'string') {
    return axiod.request(Object.assign({}, axiod.defaults, { url }, config));
  }
  return axiod.request(Object.assign({}, axiod.defaults, url));
}

axiod.defaults = {
  url: '/',
  method: 'get',
  timeout: 0,
  withCredentials: false,
  validateStatus: (status: number) => {
    return status >= 200 && status < 300;
  },
};

axiod.create = (config?: IRequest) => {
  const instance = axiod.bind({});
  instance.defaults = Object.assign({}, axiod.defaults, config);

  instance._request = request;

  instance.request = (options: IRequest): Promise<IAxiodResponse> => {
    return instance._request(Object.assign({}, instance.defaults, options));
  };
  instance.get = (url: string, config?: IConfig) => {
    return instance.request(
      Object.assign({}, { url }, config, { method: 'get' }),
    );
  };
  instance.post = (url: string, data?: Data, config?: IConfig) => {
    return instance.request(
      Object.assign({}, { url }, config, { method: 'post', data }),
    );
  };
  instance.put = (url: string, data?: Data, config?: IConfig) => {
    return instance.request(
      Object.assign({}, { url }, config, { method: 'put', data }),
    );
  };
  instance.delete = (url: string, data?: Data, config?: IConfig) => {
    return instance.request(
      Object.assign({}, { url }, config, { method: 'delete', data }),
    );
  };
  instance.options = (url: string, data?: Data, config?: IConfig) => {
    return instance.request(
      Object.assign({}, { url }, config, { method: 'options', data }),
    );
  };
  instance.head = (url: string, data?: Data, config?: IConfig) => {
    return instance.request(
      Object.assign({}, { url }, config, { method: 'head', data }),
    );
  };
  instance.connect = (url: string, data?: Data, config?: IConfig) => {
    return instance.request(
      Object.assign({}, { url }, config, { method: 'connect', data }),
    );
  };
  instance.trace = (url: string, data?: Data, config?: IConfig) => {
    return instance.request(
      Object.assign({}, { url }, config, { method: 'trace', data }),
    );
  };
  instance.patch = (url: string, data?: Data, config?: IConfig) => {
    return instance.request(
      Object.assign({}, { url }, config, { method: 'patch', data }),
    );
  };

  instance.interceptors = {
    request: addInterceptor<IAxiodRequestInterceptor, IAxiodRequestErrorInterceptor>(),
    response: addInterceptor<IAxiodResponseInterceptor, IAxiodResponseErrorInterceptor>(),
  };

  instance.interceptors.request.list = [];
  instance.interceptors.response.list = [];

  return instance;
};

async function request<T = any>(this: typeof axiod, config: IRequest): Promise<IAxiodResponse<T>> {
  if (this.interceptors.request.list.length > 0) {
    for (const interceptor of this.interceptors.request.list) {
      if (interceptor) {
        const { fulfilled } = interceptor;
        if (fulfilled && config) {
          config = await fulfilled(config);
        }
      }
    }
  }

  let {
    url = '/',
    baseURL,
    method,
    headers,
    params = {},
    data,
    timeout,
    withCredentials,
    auth,
    validateStatus,
    paramsSerializer,
    transformRequest,
    transformResponse,
    redirect,
  } = config;

  // Url and Base url
  if (baseURL) {
    url = urlJoin(baseURL, url);
  }

  // Method
  if (method) {
    if (methods.indexOf(method.toLowerCase().trim()) === -1) {
      throw new Error(`Method ${method} is not supported`);
    } else {
      method = method.toLowerCase().trim();
    }
  } else {
    method = 'get';
  }

  // Params
  let _params = '';
  if (params) {
    if (paramsSerializer) {
      _params = paramsSerializer(params);
    } else {
      _params = Object.keys(params)
        .map((key) => {
          return (
            encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
          );
        })
        .join('&');
    }
  }

  // Add credentials to header
  if (withCredentials) {
    if (auth?.username && auth?.password) {
      if (!headers) {
        headers = {};
      }

      headers['Authorization'] = 'Basic ' +
        btoa(unescape(encodeURIComponent(`${auth.username}:${auth.password}`)));
    }
  }

  // Create fetch Request Config
  const fetchRequestObject: RequestInit = {};

  // Add method to Request Config
  if (method !== 'get') {
    fetchRequestObject.method = method.toUpperCase();
  }

  // Add params to Request Config Url
  if (_params) {
    url = urlJoin(url, `?${_params}`);
  }

  // Add body to Request Config
  if (data && method !== 'get') {
    // transformRequest
    if (
      transformRequest &&
      Array.isArray(transformRequest) &&
      transformRequest.length > 0
    ) {
      for (var i = 0; i < (transformRequest || []).length; i++) {
        if (transformRequest && transformRequest[i]) {
          data = transformRequest[i](data, headers);
        }
      }
    }

    if (
      typeof data === 'string' ||
      data instanceof FormData ||
      data instanceof URLSearchParams
    ) {
      fetchRequestObject.body = data;
    } else {
      try {
        fetchRequestObject.body = JSON.stringify(data);
        if (!headers) {
          headers = {};
        }

        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';
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

  // Timeout
  const controller = new AbortController();
  fetchRequestObject.signal = controller.signal;

  let timeoutCounter: number = 0;

  if ((timeout || 0) > 0) {
    timeoutCounter = setTimeout(() => {
      timeoutCounter = 0;
      controller.abort();
    }, timeout);
  }

  if (redirect) {
    fetchRequestObject.redirect = redirect;
  }

  // Start request
  return fetch(url, fetchRequestObject).then(async (x) => {
    // Clear timeout
    if (timeoutCounter) {
      clearTimeout(timeoutCounter);
    }

    const _status: number = x.status;
    const _statusText: string = x.statusText;

    // Data
    let _data: any = null;

    // Try to convert to json
    try {
      _data = await x.clone().json();
    } catch (ex) {
      _data = await x.clone().text();
    }

    // transformResponse
    if (transformResponse) {
      if (
        transformResponse &&
        Array.isArray(transformResponse) &&
        transformResponse.length > 0
      ) {
        for (var i = 0; i < (transformResponse || []).length; i++) {
          if (transformResponse && transformResponse[i]) {
            _data = transformResponse[i](_data);
          }
        }
      }
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
      redirect,
    };

    // Validate the status code
    let isValidStatus = true;

    if (validateStatus) {
      isValidStatus = validateStatus(_status);
    } else {
      isValidStatus = _status >= 200 && _status <= 303;
    }

    let response: IAxiodResponse<T> | null = null;
    let error: IAxiodError<T> | null = null;

    if (isValidStatus) {
      response = {
        status: _status,
        statusText: _statusText,
        data: _data,
        headers: _headers,
        config: _config,
      };
    } else {
      error = {
        response: {
          status: _status,
          statusText: _statusText,
          data: _data,
          headers: _headers,
        },
        config: _config,
      };
    }

    if (this.interceptors.response.list.length > 0) {
      for (const interceptor of this.interceptors.response.list) {
        if (interceptor) {
          const { fulfilled, rejected } = interceptor;
          if (fulfilled && response) {
            response = (await fulfilled(response)) as IAxiodResponse<T>;
          }
          if (rejected && error) {
            error = await rejected(error);
          }
        }
      }
    }

    if (error) {
      return Promise.reject(error as IAxiodError<T>);
    }

    return Promise.resolve(response as IAxiodResponse<T>);
  });
}

axiod._request = request;
axiod.request = request;

axiod.get = <T = any>(url: string, config?: IConfig) => {
  return axiod.request<T>(
    Object.assign({}, { url }, config, { method: 'get' }),
  );
};
axiod.post = <T = any>(url: string, data?: Data, config?: IConfig) => {
  return axiod.request<T>(
    Object.assign({}, { url }, config, { method: 'post', data }),
  );
};
axiod.put = <T = any>(url: string, data?: Data, config?: IConfig) => {
  return axiod.request<T>(
    Object.assign({}, { url }, config, { method: 'put', data }),
  );
};
axiod.delete = <T = any>(url: string, data?: Data, config?: IConfig) => {
  return axiod.request<T>(
    Object.assign({}, { url }, config, { method: 'delete', data }),
  );
};
axiod.options = <T = any>(url: string, data?: Data, config?: IConfig) => {
  return axiod.request<T>(
    Object.assign({}, { url }, config, { method: 'options', data }),
  );
};
axiod.head = <T = any>(url: string, data?: Data, config?: IConfig) => {
  return axiod.request<T>(
    Object.assign({}, { url }, config, { method: 'head', data }),
  );
};
axiod.connect = <T = any>(url: string, data?: Data, config?: IConfig) => {
  return axiod.request<T>(
    Object.assign({}, { url }, config, { method: 'connect', data }),
  );
};
axiod.trace = <T = any>(url: string, data?: Data, config?: IConfig) => {
  return axiod.request<T>(
    Object.assign({}, { url }, config, { method: 'trace', data }),
  );
};
axiod.patch = <T = any>(url: string, data?: Data, config?: IConfig) => {
  return axiod.request<T>(
    Object.assign({}, { url }, config, { method: 'patch', data }),
  );
};

axiod.interceptors = {
  request: addInterceptor<IAxiodRequestInterceptor, IAxiodRequestErrorInterceptor>(),
  response: addInterceptor<IAxiodResponseInterceptor, IAxiodResponseErrorInterceptor>(),
};

export default axiod;
export { axiod };
