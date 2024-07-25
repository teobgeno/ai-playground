import { sha256 } from 'js-sha256';

type request = {
    signature: string;
    group: string;
    isAborted: boolean;
    abort: any;
};

class HttpProvider {
    private requests: request[];

    constructor() {
        this.requests = [];
    }

    public request(url: string, opts: any, group = 'global', canBeCancelled = true) {
        const controller = new AbortController();
        const signal = controller.signal;
        if (!opts.headers) {
            opts = { ...opts, ...this.getHeaders() };
        }
        const signature: string = sha256(JSON.stringify({ ...opts, url: url }).toString());
        const ret = {
            signature: signature,
            execute: async () => {
                const response = await fetch(url, { ...opts, signal });
                this.clearSuccesRequest(signature);
                
                const data = await response.json();
                //const data = await response.text();

                if (this.hasResponseDataErrors(data)) {
                    return Promise.reject(data.Error);
                } else {
                    return data;
                }
            },
        };

        this.requests.push({
            signature: signature,
            group: group,
            isAborted: false,
            abort: () => (canBeCancelled ? controller.abort() : null),
        });

        return ret;
    }

    public cancelAllRequests() {
        for (const request of this.requests) {
            request.abort();
            request.isAborted = true;
            this.clearAbortedRequests();
        }
    }

    private clearAbortedRequests() {
        return (this.requests = this.requests.filter((x) => !x.isAborted));
    }

    private clearSuccesRequest(signature: string) {
        return (this.requests = this.requests.filter((x) => x.signature !== signature));
    }

    private hasResponseDataErrors(response: any) {
        if (response.ErrorId || response.Error) {
            return true;
        }
        return false;
    }

    private getHeaders() {
        const headers: { [key: string]: string } = {};
        //let authData = this.localStorageService.get<any>('authorizationData');
        //headers['app-version'] = process.env.VERSION;
        headers['Accept'] = 'application/json, text/plain, */*';
        headers['Content-Type'] = 'application/json';

        //if (authData) {
        //headers['token'] = authData.Id;
        //headers['userid'] = authData.UserId;
        headers['Cache-Control'] = 'private, no-cache, no-store, must-revalidate';
        headers['Expires'] = '-1';
        headers['Pragma'] = 'no-cache';
        //}

        return { headers: headers };
    }
}

export const httpProvider = new HttpProvider();
