import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../environmentUrls.component';
@Injectable()
export class reportService {

    constructor(
        private _router: Router,
        private _http: Http
    ) { }

    private _reportUserUrl = endPointUrl.getEnvironmentVariable('endPoint')+'reportUser';
     private _reportPostUrl	 = endPointUrl.getEnvironmentVariable('endPoint')+'reportPost';
      private _hideFromDiscoveryUrl = endPointUrl.getEnvironmentVariable('endPoint')+'hideFromDiscovery';

    reportUser(data:any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._reportUserUrl, data, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }

        reportPost(data:any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._reportPostUrl, data, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }

        hideUser(data:any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._hideFromDiscoveryUrl, data, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }




}
