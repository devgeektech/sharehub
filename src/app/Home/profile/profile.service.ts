import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../../environmentUrls.component';
@Injectable()
export class ProfileService {

    constructor(
        private _router: Router,
        private _http: Http
    ) { }
    private _saveprofileUrl = endPointUrl.getEnvironmentVariable('endPoint')+'saveProfile';
    private _profileUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getUserProfile';
    private _getFollowingUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getFollowing';
    private _getFollowersUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getFollowers';
    private _followUrl = endPointUrl.getEnvironmentVariable('endPoint')+'follow';
    private _unfollowUrl = endPointUrl.getEnvironmentVariable('endPoint')+'unfollow';
    private _postCommentsUrl = endPointUrl.getEnvironmentVariable('endPoint')+'comments';
    private _postlikeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'like';
    private _postunlikeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'unlike';
    private _deletecommentUrl = endPointUrl.getEnvironmentVariable('endPoint')+'deleteCommentsFromPost';
    private _deletePostUrl = endPointUrl.getEnvironmentVariable('endPoint')+'deletePost';


 saveprofile (user : any){
       var token = localStorage.getItem('authToken');
        let body = user;
        body.token = token;
        
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
      
        return this._http.post(this._saveprofileUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }
    profile() {
        var token = localStorage.getItem('authToken');
        let body = { token: token };

        // console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._profileUrl, body, { headers: headers })
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

    userFollowing() {
        var token = localStorage.getItem('authToken');
        let body = { token: token };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._getFollowingUrl, body, { headers: headers })
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

    userFollowers() {
        var token = localStorage.getItem('authToken');
        let body = { token: token };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._getFollowersUrl, body, { headers: headers })
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

    loadmore(offset: any) {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            offset: offset
        };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._profileUrl, body, { headers: headers })
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
         deletePost(id: any) {
        var token = localStorage.getItem('authToken');
        let body = {           
            postId: id,
            token: token
        };        

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._deletePostUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }
    usercomment(value: any) {
        var token = localStorage.getItem('authToken');
        let body = {            
            comment:value.message,
            type: value.postsType,
            postId: value.id,
            token: token
        };        

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._postCommentsUrl, body, { headers: headers })
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

    userdeletecomment(value: any) {
        var token = localStorage.getItem('authToken');
        let body = {            
            commentedByUser:value.username,          
            commentBody:value.message,
            commentId:value.commentId,
            type: value.postsType,
            postId: value.id,
            token: token
        };        

        console.log(body);
        // return;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._deletecommentUrl, body, { headers: headers })
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

                // if (res.token) {
                //     localStorage.setItem('user', res.token);S
                //     // this._router.navigate(['Pages']);
                //     return res.code;
                // }
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


     following(username:any){
         var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            userNameToFollow:username,
            userCity:localStorage.getItem('city'),
            userCountry:localStorage.getItem('countery'),
            userState:localStorage.getItem('region'),
            IPaddress:localStorage.getItem('ip')
        };
        
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._followUrl, body, { headers: headers })
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

        return this._http.post(this._unfollowUrl, body, { headers: headers })
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

    // logout() {               
    //  var token =  localStorage.removeItem('user');
    //  this._router.navigate(['login']); 
    // }

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
