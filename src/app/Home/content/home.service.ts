import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../../environmentUrls.component';

@Injectable()
export class HomeService {

    constructor(
        private _router: Router,
        private _http: Http
    ) { }

    private _homeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'home';
    private _postCommentsUrl = endPointUrl.getEnvironmentVariable('endPoint')+'comments';
    private _postlikeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'like';
    private _postunlikeUrl = endPointUrl.getEnvironmentVariable('endPoint')+'unlike';
    private _deletecommentUrl = endPointUrl.getEnvironmentVariable('endPoint')+'deleteCommentsFromPost';
      private _deletePostUrl = endPointUrl.getEnvironmentVariable('endPoint')+'deletePost';

    home() {
        var token = localStorage.getItem('authToken');
        let body = { token: token };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._homeUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);

                // if (res.token) {
                //     localStorage.setItem('user', res.token);
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

        return this._http.post(this._homeUrl, body, { headers: headers })
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

    usercomment(value: any) {
        var token = localStorage.getItem('authToken');
        let body = {            
            comment:value.message,
            type: value.postsType,
            postId: value.id,
            token: token
        };        

        console.log(body);
        // return;
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

//     public static getHeader(): Headers{
//         let myHeaders: Headers = new Headers();

//         myHeaders.set('Content-type', 'application/x-www-form-urlencoded');

//         myHeaders.append('Authorization', 'Oauth oauth_consumer_key = "Qmuv6jzg1ixzrhVDBk6LYiquu",' +
//         'oauth_signature_method="HMAC-SHA1",' +
//         'oauth_timestamp='+  Math.floor(Date.now() / 1000) +',' +
//         'oauth_nonce='+ HomeService.randomString() +',' +
//         'oauth_version="1.0",' +
//         'oauth_token="djKnEJjJ7TYw0VJEsxGEtlfg",' +
//         'oauth_signature="uRpPuOZEEStiy8ohVfFVW8zRNYw%3D"');
        
//         return myHeaders;
//     }
// public static randomString() {
//     var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     var result = '';
//     for (var i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
//     return result;
// }

// getsignature(id: any, postsType: any) {
//         let body = {
//             postId: id,
//             label: 'Photo'
//         };
//         let myHeaders: Headers = new Headers();
//             myHeaders.set('Content-type', 'application/x-www-form-urlencoded');

//             let opt: RequestOptions = new RequestOptions({
//                 headers: HomeService.getHeader()
//             });

//         return this._http.post("https://api.twitter.com/1.1/statuses/update.json?status=Hello%20Ladies%20%2b%20Gentlemen%2c%20a%20signed%20OAuth%20request%21", body, { headers: headers })
//             .map(res => res.json())
//             .map((res) => {
  
//                 return res;
//             })
//     }


}
