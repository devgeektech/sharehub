import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { endPointUrl } from '../../environmentUrls.component';
declare const google: any;
declare const jQuery: any;
@Injectable()

export class CreatePostService {

    constructor(
        private _router: Router,
        private _http: Http
    ) { }

    private _sponsoredUrl = endPointUrl.getEnvironmentVariable('endPoint')+'userPosts';
    private _productUrl = endPointUrl.getEnvironmentVariable('endPoint')+'createBusinessProduct';
    private _getMySponsorsUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getMySponsors';
    private _getProductsOfferedUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getProductsOffered';
    private _getAllCategoryUrl = endPointUrl.getEnvironmentVariable('endPoint')+'getAllCategoryTags';
    geocoder: any;


    sponsoredPost(data: any) {
        var token = localStorage.getItem('authToken');
        let body = data;
        body.token = token;
        console.log("in service")
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._sponsoredUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    };
    productPost(data: any) {
        var token = localStorage.getItem('authToken');
        let body = data;
        body.token = token;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._productUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    };

            getCategory() {
                 let body={
                    'token' : localStorage.getItem('authToken')
                }; 
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            return this._http.post(this._getAllCategoryUrl,body, { headers: headers })
                .map(res => res.json())
                .map((res) => {
                    console.log(res);
                    return res;
                })
        };
      getMySponsors() {
          let body={
            'token' : localStorage.getItem('authToken')
          }; 
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._getMySponsorsUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    };
    getProductsOffered(data: any) {
        var token = localStorage.getItem('authToken');
        let body = data;
        body.token = token;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._getProductsOfferedUrl, body, { headers: headers })
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                return res;
            })
    };

    uploadImageOnCloudinary(data: any) {
        return jQuery.ajax({
                        url: 'https://api.cloudinary.com/v1_1/merriment/image/upload',
                        data: data,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        xhr: function () {
                            if ((<any>window).XMLHttpRequest) {
                                var xhr = new XMLHttpRequest();
                            } else {
                                 xhr = new ActiveXObject("Microsoft.XMLHTTP");
                            }
                            //var xhr = new window.XMLHttpRequest();
                            xhr.upload.addEventListener("progress", function (evt:any) {
                                if (evt.lengthComputable) {
                                    var percentComplete = evt.loaded / evt.total;
                                    console.log(percentComplete);
                                }
                            }, false);
                            return xhr;
                        },
                        success: function (data:any) {
                            return data;
                        }
                    });
                

        // return this._http.post("https://api.cloudinary.com/v1_1/merriment/image/upload", data)
        //     .map(res => res.json())
        //     .map((res) => {
        //         console.log(res);
        //         return res;
        //     })
    }

    getLatLong(address: any) {
        return this._http.post("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false", address)
            .map(res => res.json())
            .map((res) => {
                var res = res.results[0].geometry.location;
                return res;
            })
    }
    shortUrl(url: any) {
        var api_url = 'https://meri.mn/yourls-api.php';
        var obj = {
            signature: "8cb6cadc0f",
            action: "shorturl",
            format: "json",
            url: url
        };
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ method: RequestMethod.Post, headers: headers });
        let body = this.serializeObj(obj);
        return this._http.post(api_url, body, options)
            .map(res => res.json())
            .map((res) => {
                return res;
            })
    }
    private serializeObj(obj: any) {
        var result: any = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

        return result.join("&");
    }



}
