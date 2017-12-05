import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
declare const jQuery:any;
declare const firebase:any;
declare const OAuth:any;
@Injectable() 
export class UrlToImageService {

    private provider:any;
    private consumerkey = '5W2sj0oyDae2vIObC1C31tuiD';
    private consumersecret = 'DcIruKeI7euwpaBUTNl77CHq3pbzczn6TG2ZYjaGmzpbA3y9OO';
    private accesstoken = '798406403375464448-hbWbgFfvhvyC3S5kQKkzczWhmMkM6v6';
    private accesstokensecret = 'aG3dEkeUi6FLLeNpInytN5fPHt8jbF8IzigQgtIlJQiOh';
    
    constructor(private _router: Router,private _http: Http) {
        // var config = {
        //     apiKey: "AIzaSyChTIWh-oEJC6x4MFOvOfhGQkMi9TzXWGc",
        //     authDomain: "merriment-f6006.firebaseapp.com",
        //     databaseURL: "https://merriment-f6006.firebaseio.com",
        //     projectId: "merriment-f6006",
        //     storageBucket: "",
        //     messagingSenderId: "856417890837"
        // };
        // if (!firebase.apps.length) {
        //     firebase.initializeApp(config);
        // }
     }

    //   b64toBlob(b64Data:any, contentType:any, sliceSize:any) {
    //         contentType = contentType || '';
    //         sliceSize = sliceSize || 512;

    //         var byteCharacters = atob(b64Data);
    //         var byteArrays:any = [];

    //         for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    //             var slice = byteCharacters.slice(offset, offset + sliceSize);

    //             var byteNumbers = new Array(slice.length);
    //             for (var i = 0; i < slice.length; i++) {
    //                 byteNumbers[i] = slice.charCodeAt(i);
    //             }

    //             var byteArray = new Uint8Array(byteNumbers);

    //             byteArrays.push(byteArray);
    //         }

    //         var blob = new Blob(byteArrays, {type: contentType});
    //         return blob;
    //     }
        // dataURLtoBlob(dataurl:any) {
        //     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        //     bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        //         while(n--){
        //             u8arr[n] = bstr.charCodeAt(n);
        //         }
        //     return new Blob([u8arr], {type:mime});
        // }
     

    previewFile(file:any, status:any) {
    
         var request = new XMLHttpRequest();
            request.open('GET', file, true);
            request.responseType = 'blob';
            request.onload = ()=> {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
                reader.onload =  (e:any)=>{
                    var b64String = e.target.result;
                    var blobData = this.dataURLtoBlob(b64String)
                     OAuth.initialize("JvSu5oqOtA3w72Rs96_ZK4ZRxfI"); //QvpDyrH8ejOnZSkRVK35g7Pz_uU
                        var cap = "";
                        OAuth.popup("twitter").then((result:any)=> {
                            var data = new FormData();
                            data.append('status', status);
                            data.append('media[]', blobData, 'b64String.jpg');
                            return result.post('/1.1/statuses/update_with_media.json', {
                                data: data,
                                cache:false,
                                processData: false,
                                contentType: false
                            });
                        }).done((data:any) =>{
                            console.log('inside success')
                            console.log(data);
                            jQuery('.modal').modal('hide');
                        }).fail((e:any) => {
                            var errorTxt = JSON.stringify(e, null, 2);
                            console.log('inside error')
                            console.log(errorTxt);
                            jQuery('.modal').modal('hide');
                        });

                }

            }
            request.send();
            

         

        // //Convert base64 into blob
        // //cf http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
        

        



        
    //     this.provider = new firebase.auth.TwitterAuthProvider();
        
    //     firebase.auth().onAuthStateChanged((user:any) => {
    //     if (user) {
    //         firebase.auth().getRedirectResult().then(function(result:any) {
    //             if (result.credential) {
    //                 // For accessing the Twitter API.
    //                 var token = result.credential.accessToken;
    //                 var secret = result.credential.secret;
    //             }
    //             var user = result.user;
    //             });
    //         console.log('user:', user);
    //     } else {
    //         this.twitterlogin();
    //     }
    // }); 
    
    //         var request = new XMLHttpRequest();
    //         request.open('GET', file, true);
    //         request.responseType = 'blob';
    //         request.onload = ()=> {
    //         var reader = new FileReader();
    //         reader.readAsDataURL(request.response);
    //             reader.onload =  (e:any)=>{
    //                 var blob = this.dataURLtoBlob(e.target.result)
    //                 console.log(blob)
    //                 var fd = new FormData();
    //                 fd.append('media[]',blob, "avatar.jpg");
    //                 var headers = new Headers(); 
    //                 headers.append('consumerkey', this.consumerkey);
    //                 headers.append('consumersecret', this.consumersecret);
    //                 headers.append('accesstoken', this.accesstoken);
    //                 headers.append('accesstokensecret', this.accesstokensecret);

    //                 // jQuery.ajax({
    //                 //     url: 'https://upload.twitter.com/1.1/media/upload.json',
    //                 //     data: fd,
    //                 //     cache: false,
    //                 //     contentType: false,
    //                 //     processData: false,
    //                 //     type: 'POST',
    //                 //     success: (data:any)=>{
    //                 //         alert(data);
    //                 //     }
    //                 // });
    //                 jQuery.ajax({
    //                     url: 'https://upload.twitter.com/1.1/media/upload.json',
    //                     data: fd,
    //                     cache: false,
    //                     contentType: false,
    //                     processData: false,
    //                     type: 'POST',
    //                     success: (data:any)=>{
    //                         alert(data);
    //                     }
    //                 });
    //             };
    //         };
    //         request.send();
        }

        dataURLtoBlob(dataurl:any) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
            return new Blob([u8arr], {type:mime});
        }

        twitterlogin(){
            firebase.auth().signInWithPopup(this.provider).then((result:any)=> {
                var token = result.credential.accessToken;
                var secret = result.credential.secret;
                var user = result.user;
                console.log('access_token:-', token);
                console.log('secret:-', secret);
                console.log('try to login')
            }).catch((error:any)=> {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
            });
    }

    setTwitterText(mainObject:any, shortUrl:string) {
        console.log('inside twitter');
        var cap = '';
        if(mainObject.postCaption) {
            for(var i=0; i<mainObject.postCaption.length; i++) {
                if(i == 0){
                    cap = mainObject.postCaption[i]
                } else {
                    cap = cap + " "+ mainObject.postCaption[i];
                }
            }
        };
        if(cap == 'null'){
            cap = '';
        }
        var status = cap + ' #merriment ' + shortUrl || "";
        return status;
    }


}

