import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../../environmentUrls.component';

@Injectable()
export class listService {

    constructor(
        private _router: Router,
        private _http: Http
    ) { }


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
    private _allBusinessPostsUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getAllBusinessPosts';
    private _listcount =  endPointUrl.getEnvironmentVariable('endPoint')+'listsCount';
    private _likecount =  endPointUrl.getEnvironmentVariable('endPoint')+'getAllLikes';
    private _userListUrl =  endPointUrl.getEnvironmentVariable('endPoint')+'getUserLists';
    private _followList =  endPointUrl.getEnvironmentVariable('endPoint')+'followList';
    private _unfollowList =  endPointUrl.getEnvironmentVariable('endPoint')+'unfollowList'; 
    private _changeRoleList =  endPointUrl.getEnvironmentVariable('endPoint')+'changeRole';
    private _createList =  endPointUrl.getEnvironmentVariable('endPoint')+'createList';
    private _addPostToList =  endPointUrl.getEnvironmentVariable('endPoint')+'addPostToList';
    private _getListInfo =  endPointUrl.getEnvironmentVariable('endPoint')+'getListInfo';
    private _removePostFromList =  endPointUrl.getEnvironmentVariable('endPoint')+'removePostFromList';
    private _getListFollowers =  endPointUrl.getEnvironmentVariable('endPoint')+'getListFollowers';
    private _getListDetails =  endPointUrl.getEnvironmentVariable('endPoint')+'getListDetails';
    private _searchMyLists =  endPointUrl.getEnvironmentVariable('endPoint')+'searchMyLists';
    private _deletePostUrl =  endPointUrl.getEnvironmentVariable('endPoint')+'deletePost';
    getUserList(uname: any) {
        var token = localStorage.getItem('authToken');
        var cuname = localStorage.getItem('username');
        
        let body = {username:uname,currentUserName:cuname, token: token}
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._userListUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            });
    }
    getListDetails(listiD: any) {
        var token = localStorage.getItem('authToken');
        let body = { listId: listiD, token: token}
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._getListDetails, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            });
    }

    personprofile(name: any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, membername: name };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._memberprofileUrl, body, { headers: headers })
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

    businessPosts(name: any) {
        var token = localStorage.getItem('authToken');
        var uname = localStorage.getItem('username')
        let body = { token: token, username: name }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._allBusinessPostsUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
    }

    memberFollowing(name: any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, membername: name };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._memberfollowingUrl, body, { headers: headers })
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

                // if (res.token) {
                //     localStorage.setItem('user', res.token);S
                //     // this._router.navigate(['Pages']);
                //     return res.code;
                // }
                return res;
            })
    }

    loadmore(offset: any, name: any) {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            membername: name,
            offset: offset
        };

        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._memberprofileUrl, body, { headers: headers })
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
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._memberfollowUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
    }

    listCount(postId: string): Observable<any> {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            postId: postId
        };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._listcount, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })    
    }

    likeCount(postId: string) {
        var token = localStorage.getItem('authToken');
        let body = {
            token: token,
            postId: postId,
            postType: '0'
        };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._likecount, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
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

followList(id:number, usr: string) {
    var token = localStorage.getItem('authToken');
        let body = { token: token,listId: id,username: usr };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._followList, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
}
unfollowList(id:number, usr: string) {
    var token = localStorage.getItem('authToken');
        let body = { token: token,listId: id,username: usr };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._unfollowList, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
}

changeRole(id: number, role: number) {
    var token = localStorage.getItem('authToken');
        let body = { token: token,listId: id,role: role };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._changeRoleList, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            })
}

    createList(user:any, listname:any) {
     var token = localStorage.getItem('authToken');
        let body = { token: token, listname:listname, username:user };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._createList, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
        })
    }

    addPostToList(listID:any, postID:any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, listId:listID, postId: postID };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._addPostToList, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
        })
    }

    getListInfo(un:any, postID:any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, username:un, postId: postID };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._getListInfo, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
        })
    }
    removePostFromList(listID:any, postID:any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, listId:listID, postId: postID };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._removePostFromList, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
        })
    }
    getListFollowers(listID: any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, listId:listID };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._getListFollowers, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
        })
    }

    searchMyLists(key:any, limit:any, offset:any) {
        var token = localStorage.getItem('authToken');
        let body = { token: token, keyToSearch:key };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._searchMyLists, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                return res;
        })
    }
    

}
