import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../environmentUrls.component';
@Injectable()
export class HeaderService {

    constructor(
        private _router: Router,
        private _http: Http
    ) { }


    private _recentactivityUrl = endPointUrl.getEnvironmentVariable('endPoint')+'selfActivity';
    private _searchUrl = endPointUrl.getEnvironmentVariable('endPoint')+'generalSearch';
    private _notificationCountUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getUnseenNotificationCount';
    private _productUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getProductsByCategoryAndProductName';
    private _acceptRejectReqUrl = endPointUrl.getEnvironmentVariable('endPoint')+'acceptFollowRequest';
    private _aproveSponUrl = endPointUrl.getEnvironmentVariable('endPoint')+'approveforsponsorship';
    private _declineSponsorUrl = endPointUrl.getEnvironmentVariable('endPoint')+'declineSponsorship';
   
    
     approvesSponsor(name: any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, requestingUserName: name };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._aproveSponUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }
    
    declineSponsor(name: any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, requestingUserName: name };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._declineSponsorUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }
     acceptRejectReq(data:any) {
        var token = localStorage.getItem('authToken');
        let body = {token : token,
        membername:data.membername,
        action:data.action
       };
        
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._acceptRejectReqUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log('activity', res);
                return res;
            })
    }

    recentactivitypeople(limit:any, offset:any) {
        var token = localStorage.getItem('authToken');
        let body = {token : token, limit:limit, offset:offset};
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._recentactivityUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log('activity', res);
                return res;
            })
    }

    searchpeople(value:any, limit:any, offset:any) {
        var token = localStorage.getItem('authToken');
        let body = {token : token, keyToSearch:value, limit:limit, offset:offset};
        
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._searchUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
    }
       searchproduct(value:any, limit:any, offset:any) {
        var token = localStorage.getItem('authToken');
        let body = {token : token, searchKey:value, limit:limit, offset:offset};
        
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._productUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
    }

   notificationCount() {
        var token = localStorage.getItem('authToken');
        let body = {token : token};
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
          return this._http.post(this._notificationCountUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
    }


        notificationCountInterval() {
        var token = localStorage.getItem('authToken');
        let body = {token : token};
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return Observable
        .interval(60000)
        .flatMap(() => {
             return this._http.post(this._notificationCountUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
        });
    }
    
    
}
