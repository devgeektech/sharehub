import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../../environmentUrls.component';

@Injectable()
export class DiscoverpostService {

    constructor(
        private _router: Router,
        private _http: Http
    ) { }

    private keywordSearchUrl = '';

   

    searchKeyword(keyword, callback) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.keywordSearchUrl =  'http://api.us.socrata.com/api/catalog/v1?q=' + keyword;
        this.http.get('/api/items').subscribe(data => {
            // Read the result field from the JSON response.
            this.results = data['results'];
        });
    }

    loadmore(offset: any) {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            offset: offset
        };
        
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._discoverprofileUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                
                // if (res.token) {
                //     localStorage.setItem('user', res.token);S
                //     // this._router.navigate(['Pages']);
                //     return res.code;
                // }
                return res;
            })
    }

    following(username:any){
         var token = localStorage.getItem('authToken');
        let body = {
            token: token,
           userNameToFollow:username
        };
        
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._discoverfollowUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);

                // if (res.token) {
                //     localStorage.setItem('user', res.token);S
                //     // this._router.navigate(['Pages']);
                //     return res.code;
                // }
                return res;
            })
    }

    follow(username:any){
         var token = localStorage.getItem('authToken');
        let body = {
            token: token,
           unfollowUserName:username
        };
        
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._discoverunfollowUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);

                // if (res.token) {
                //     localStorage.setItem('user', res.token);S
                //     // this._router.navigate(['Pages']);
                //     return res.code;
                // }
                return res;
            })
    }
    
    
}
