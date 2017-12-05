import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../../environmentUrls.component';

@Injectable()
export class DiscoverpeopleService {

    constructor(
        private _router: Router,
        private _http: Http
    ) { }
    private _searchexploreUrl = endPointUrl.getEnvironmentVariable('endPoint')+'search-explore';
    private _memberfollowUrl = endPointUrl.getEnvironmentVariable('endPoint')+'follow';
    private _memberunfollowUrl = endPointUrl.getEnvironmentVariable('endPoint')+'unfollow';
    private _postlikeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'like';
    private _postunlikeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'unlike';
   
    getExplore(){
        var token = localStorage.getItem('authToken');
        let body = {token : token};
            body['token']=token;
        body['offset']=0;
        body['limit']=20;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._searchexploreUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }


   loadmore(offset: any, name: any) {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            membername: name,
            limit:20,
            offset:offset
        };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._searchexploreUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }

    userlike(id: any, postsType: any) {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            postId: id,
            label: 'Photo'
        };

        if (postsType == 1)
            body.label = 'Video';

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._postlikeUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }

        userunlike(id: any, postsType: any) {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            postId: id,
            label: 'Photo'
        };

        if (postsType == 1)
            body.label = 'Video';

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._postunlikeUrl, body, { headers: headers })
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

    following(username: any) {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            userNameToFollow: username,
            userCity:localStorage.getItem('city'),
            userCountry:localStorage.getItem('countery'),
            userState:localStorage.getItem('region'),
            IPaddress:localStorage.getItem('ip')
        };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._memberfollowUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }
    privateprofile(username: any, privateMmber: any) {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            userNameToFollow : username,
            userCity:localStorage.getItem('city'),
            userCountry:localStorage.getItem('countery'),
            userState:localStorage.getItem('region'),
            IPaddress:localStorage.getItem('ip')
        };

        console.log(body);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._memberfollowUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }
    follow(username: any) {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            unfollowUserName: username
        };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._memberunfollowUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }

    shortUrl(url: any) {
        console.log(url);
        var api_url  = 'https://meri.mn/yourls-api.php';
        var obj = {
            signature: "8cb6cadc0f",
            action:   "shorturl",
            format:   "json",
            url: url
        };
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions( {method: RequestMethod.Post, headers: headers });
        let body = this.serializeObj(obj);
        return this._http.post(api_url, body, options)
            .map(res => res.json())
            .map((res) => {
                return res;
            })  
    }

    private serializeObj(obj: any) {
    var result:any = [];
    for (var property in obj)
        result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
            return result.join("&");
        }


    
    
}
