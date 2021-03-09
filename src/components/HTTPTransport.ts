const METHODS = {
    GET: 'GET',
    PUT: 'PUT',
    POST: 'POST',
    DELETE: 'DELETE'
};

interface IOptions {
    data?: any;
    timeout?: number;
    headers?: object;
}

function queryStringify(data) {
    return Object.entries(data).reduce((acc, res) => {
        const [name, value] = res;
        return `${acc}${name}=${value.toString()}&`;
    }, '?');
}

export class HTTPTransport {
    get = (url, options: IOptions = {}) => {
        if (options.data) {
            url += queryStringify(options.data);
        }

        return this.request(url, {...options, method: METHODS.GET}, options.timeout);
    };

    put = (url, options: IOptions = {}) =>
        this.request(url, {...options, method: METHODS.PUT}, options.timeout);

    post = (url, options: IOptions = {}) =>
        this.request(url, {...options, method: METHODS.POST}, options.timeout);

    delete = (url, options: IOptions = {}) =>
        this.request(url, {...options, method: METHODS.DELETE}, options.timeout);

    request = (url, options, timeout = 5000): Promise<XMLHttpRequest> => {
        const {method, headers, data} = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.responseType = 'json';
            xhr.withCredentials = true;
            if (headers) {
                Object.entries(headers).forEach(header => {
                    const headerKey = header[0];
                    const headerValue = header[1] as string;
                    xhr.setRequestHeader(headerKey, headerValue);
                });
            }

            xhr.send(data || '');
            xhr.onload = function () {
                return resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;
        });
    };
}
