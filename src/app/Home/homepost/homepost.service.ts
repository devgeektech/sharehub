import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../../environmentUrls.component';

@Injectable()
export class homepostService {

    constructor(
        private _router: Router,
        private _http: Http
    ) { }

    
    private _memberprofileUrl = endPointUrl.getEnvironmentVariable('endPoint')+'member-profile';    
    private _memberfollowUrl = endPointUrl.getEnvironmentVariable('endPoint')+'follow';
    private _memberunfollowUrl = endPointUrl.getEnvironmentVariable('endPoint')+'unfollow';
    private _postlikeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'like';
    private _postunlikeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'unlike';
    private _postCommentsUrl = endPointUrl.getEnvironmentVariable('endPoint')+'comments';
    private _deletecommentUrl = endPointUrl.getEnvironmentVariable('endPoint')+'deleteCommentsFromPost';
    private _postShareUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getPostsBySharedUrl';
    private _getPostUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getPostByID';
    private _getPublicPostUrl = endPointUrl.getEnvironmentVariable('endPoint')+'publicGetPostByID';
    private _deletePostUrl = endPointUrl.getEnvironmentVariable('endPoint')+'deletePost';
  
       getPublicPost(id: any) {
        let body = {
            postId: id
        };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._getPublicPostUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }
    getPost(id: any) {
        let body = {
            postId: id,
            token:localStorage.getItem('authToken')
        };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._getPostUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }
    personShareProfile(name:any, id:any) {
        let body = {
              membername:name,
              postId:id
            };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._postShareUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }

    personprofile(name:any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, membername:name};
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._memberprofileUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
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
        return this._http.post(this._memberfollowUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
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
