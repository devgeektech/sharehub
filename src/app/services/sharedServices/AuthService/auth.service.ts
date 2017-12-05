import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../../environmentUrls.component';

export class User {
    constructor(
        public username: string,
        public password: string) { }
}

@Injectable()
export class AuthService {

    private _loginUrl =  endPointUrl.getEnvironmentVariable('endPoint')+'login';
    private _registrationUrl =  endPointUrl.getEnvironmentVariable('endPoint')+'register';
    private _resetPasswordUrl =  endPointUrl.getEnvironmentVariable('endPoint')+'resetPassword';
    private _changePasswordUrl =  endPointUrl.getEnvironmentVariable('endPoint')+'changePassword';
    private _signupemailUrl =  endPointUrl.getEnvironmentVariable('endPoint')+'emailCheck';
    private _signupeusernameUrl =  endPointUrl.getEnvironmentVariable('endPoint')+'usernameCheck';
    // private _fbloginUrl = 'http://138.197.47.224:3000/api/facebookContactSync';

    constructor(
        private _router: Router,
        private _http: Http) { }

    logout() {
        localStorage.removeItem("user");
        // this._router.navigate(['Login']);
    }
    auhenticateuser: any;
    login(user: any) {

        let body = JSON.stringify(user);
        // console.log(user);

        let headers = new Headers();

        headers.append('Content-Type', 'application/json');

        return this._http.post(this._loginUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                if (res.token) {
                    localStorage.setItem('authToken', res.token);
                    localStorage.setItem('username', res.username);
                    localStorage.setItem('isBusiness', res.businessProfile);
                    localStorage.setItem('profilePicUrl', res.profilePicUrl);
                    //  this._router.navigate(['Home']);
                    // return res.code;
                }
                return res;
            })
        //.catch(this.handleError);
    }

    register(user: any) {

        let body = JSON.stringify(user);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(body);
       
        return this._http.post(this._registrationUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                if (res.code != 2004 && res.code != 1995) { 
                    if (res.response.authToken) {
                        localStorage.setItem('authToken', res.response.authToken);
                        localStorage.setItem('username', res.response.username);
                    }
                }
                // if (res.token) {
                //     localStorage.setItem('user', res.token);S
                //     // this._router.navigate(['Pages']);
                //     return res.code;
                // }
                return res;
            })
    }

    signupemailcheck(user: any) {

        let body = JSON.stringify(user);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(body);
       
        return this._http.post(this._signupemailUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                // if (res.code != 2004 && res.code != 1995) { 
                //     if (res.response.authToken) {
                //         localStorage.setItem('authToken', res.response.authToken);
                //         localStorage.setItem('username', res.response.username);
                //     }
                // }
                // if (res.token) {
                //     localStorage.setItem('user', res.token);S
                //     // this._router.navigate(['Pages']);
                //     return res.code;
                // }
                return res;
            })
    }

    signupusernamecheck(user: any) {

        let body = JSON.stringify(user);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(body);
       
        return this._http.post(this._signupeusernameUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                // if (res.code != 2004 && res.code != 1995) { 
                //     if (res.response.authToken) {
                //         localStorage.setItem('authToken', res.response.authToken);
                //         localStorage.setItem('username', res.response.username);
                //     }
                // }
                // if (res.token) {
                //     localStorage.setItem('user', res.token);S
                //     // this._router.navigate(['Pages']);
                //     return res.code;
                // }
                return res;
            })
    }

    resetPassword(user: any) {
        let body = JSON.stringify(user);
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._resetPasswordUrl, body, { headers: headers })
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


    changePassword(user: any) {
        // console.log(user);
        // user.passwordResetLink = 'AmB8qLwREFq6FvKW67lirq6q63mCxV68';
        let body = JSON.stringify(user);
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._changePasswordUrl, body, { headers: headers })
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

    registerfacebooklogin(user: any, referer:any) {
        let url = window.location.href
        var ref = ''
        if(url.indexOf('?ref=') != -1){
            ref = url.split('?ref=')[1];
        }
        let body = {
            email: user.email,
            signUpType : 1,
            deviceType: 3,
            facebookId: user.id,            
            username: user.name.toLowerCase().replace(/ /g,''),
            dob: user.birthday,
            gender:user.gender,
            referer:ref
        }
        console.log(body);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._registrationUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                if (res.code != 2005) {                     
                  if (res.response.authToken) {
                    localStorage.setItem('authToken', res.response.authToken);
                    localStorage.setItem('username', res.response.username);
                     }
                }               
                return res;
            })
    }

    facebooklogin(user: any) {
        let body = {           
            facebookLogin: 1,           
            facebookId: user.id,            
            username: user.name.toLowerCase().replace(/ /g,'')
        }
        console.log(body);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._loginUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                if (res.token) {
                    localStorage.setItem('authToken', res.token);
                    localStorage.setItem('username', res.username);
                }                
                return res;
            })
    }


    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    checkCredentials() {
        if (localStorage.getItem("authToken") === null) {
            this._router.navigate(['Login']);
        }
    }
}