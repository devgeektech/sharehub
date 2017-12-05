import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../../environmentUrls.component';
declare const $: any;

@Injectable()
export class personService {

    constructor(
        private _router: Router,
        private _http: Http
    ) { }

    private _publicmemberprofileUrl = endPointUrl.getEnvironmentVariable('endPoint')+'publicMemberProfile';
    private _memberprofileUrl = endPointUrl.getEnvironmentVariable('endPoint')+'member-profile';
    private _memberfollowersUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getMemberFollowers';
    private _memberfollowingUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getMemberFollowing';
    private _memberfollowUrl = endPointUrl.getEnvironmentVariable('endPoint')+'follow';
    private _memberunfollowUrl = endPointUrl.getEnvironmentVariable('endPoint')+'unfollow';
    private _privateprofileUrl = endPointUrl.getEnvironmentVariable('endPoint')+'setPrivateProfile';
    private _postlikeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'like';
    private _postunlikeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'unlike';
    private _postCommentsUrl = endPointUrl.getEnvironmentVariable('endPoint')+'comments';
    private _deletecommentUrl = endPointUrl.getEnvironmentVariable('endPoint')+'deleteCommentsFromPost';
    private _getSponsorStatus = endPointUrl.getEnvironmentVariable('endPoint')+'getSponsorStatus';
    private _applyforsponsorship = endPointUrl.getEnvironmentVariable('endPoint')+'applyforsponsorship';
    private _deletePostUrl = endPointUrl.getEnvironmentVariable('endPoint')+'deletePost';
    private _sponsorThisUrl = endPointUrl.getEnvironmentVariable('endPoint')+'approveforsponsorship';
    private _declineSponsorUrl = endPointUrl.getEnvironmentVariable('endPoint')+'declineSponsorship';
   
    sponsorThis(name: any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, requestingUserName: name };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._sponsorThisUrl, body, { headers: headers })
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
    publicprofile(name: any) {
        let body = { membername: name };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._publicmemberprofileUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }
    personprofile(data:any) {
        var token = localStorage.getItem('authToken');
        let body = data;
        body['token']=token;
        body['offset']=0;
        body['limit']=20;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._memberprofileUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    }

    memberFollowing(name: any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, membername: name };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._memberfollowingUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
        }

    memberFollowers(name: any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, membername: name };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._memberfollowersUrl, body, { headers: headers })
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

        return this._http.post(this._memberprofileUrl, body, { headers: headers })
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
            comment: value.message,
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

                // if (res.token) {
                //     localStorage.setItem('user', res.token);S
                //     // this._router.navigate(['Pages']);
                //     return res.code;
                // }
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

                // if (res.token) {
                //     localStorage.setItem('user', res.token);S
                //     // this._router.navigate(['Pages']);
                //     return res.code;
                // }
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
    
    getSponsorStatus(username: any) {
        var token = localStorage.getItem('authToken');
        let body = {token: token,username : username
        };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._getSponsorStatus, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
    }

    applyforsponsorship(username: any) {
        var token = localStorage.getItem('authToken');
        let body = {token: token,sponsorUserName : username
        };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._applyforsponsorship, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
    }


}
