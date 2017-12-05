import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HeaderService } from '../header/header.service';
import { Router } from '@angular/router';
import { EditProfileService } from '../Home/profileedit/editprofile.service';
import { ModalComponent } from '../Publiclogin/modal.component';
import { Location } from '@angular/common';
declare const jQuery: any;

@Component({
   selector: 'header',
   // templateUrl : '/header.html',
   template: require('./header.html'),
   directives: [ROUTER_DIRECTIVES, ModalComponent],
   providers: [HeaderService, EditProfileService]

})
export class HeaderComponent {
   uname = ''
   constructor(private _headerService: HeaderService, private _router: Router, private location: Location, private _editProfileService: EditProfileService) {
      this.uname = localStorage.getItem('username');
   }
   private values = '';
   private limit = 10;
   private offset = 0;
   private data = 0;
   private dataPro = 0;
   private blur_close = false;
   private activity: any;
   private reqData: any;
   private recentactivity: any;
   private recentactivityloader = false;
   private recentactivityactivity = false;
   private userData: any;
   search_person = false;
   search_hashtag = false;
   search_location = false;
   search_product = false;
   isLogin: boolean = false;
   notiCount: number = 0;
   notiLoader: boolean = true;
   activityLen: boolean = false;
   dataObj: any = {};
   ngOnInit() {
      var token = localStorage.getItem('authToken');

      if (token) {
         this._editProfileService.getAllSponsorshipRequests()
            .subscribe((res) => {
              console.log(res);
               console.log("sponsored request");
               this.reqData = res.data;
               this.commentfunction(0);
            })

         this._headerService.notificationCount()
            .subscribe((res) => {
               this.notiCount = res.data.count;
            });
         this._headerService.notificationCountInterval()
            .subscribe((res) => {
               this.notiCount = res.data.count;
            });
      }
      else {
         this.isLogin = true;
         var url = this.location.path();
         if (url.indexOf('?ref=') >= 0) {
            this.dataObj['referrer'] = url.split('?ref=')[1];
         }
      }

      jQuery.get("https://ipinfo.io", function(response: any) {
         localStorage.setItem("ip", response.ip);
         localStorage.setItem("countery", response.country);
         localStorage.setItem("city", response.city);
         localStorage.setItem("region", response.region);
      }, "jsonp");


      // jQuery('.notification').on('click', function (event:any) {
      //       console.log("ahhhh")
      //       jQuery(this).addClass("open");
      // });

      // jQuery('body').on('click', function (e) {
      // if (!jQuery('li.dropdown.mega-dropdown').is(e.target) && jQuery('li.dropdown.mega-dropdown').has(e.target).length === 0 && jQuery('.open').has(e.target).length === 0) {
      //       jQuery('li.dropdown.mega-dropdown').removeClass('open');
      // }
      // });

   }


   list() {
      this._router.navigate(['/' + this.uname + '/lists']);
   }

   recentactivityy() {
      this.recentactivityactivity = true;
      this._headerService.recentactivitypeople(this.limit, this.offset)
         .subscribe((res) => {
            console.log(res);
            console.log("aboe")
            this.notiLoader = false;
            this.activity = res.data;
            if (res.data.length == 0) {
               this.activityLen = true;
            }
            this.notiCount = 0;
            this.commentfunction(1);
            setTimeout(() => {
               jQuery(".noti_bg").addClass('no_noti_bg');
            }, 1500);
         });
   }



   commentfunction(n: any) {
      if (n == 1) {
         var len = this.activity.length;
         for (var i = 0; i < len; i++) {
            var post = this.activity[i].createdOn;
            var poston = Number(post);
            var postdate = new Date(poston);
            var currentdate = new Date();
            var timeDiff = Math.abs(postdate.getTime() - currentdate.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var diffHrs = Math.round((timeDiff % 86400000) / 3600000);
            var diffMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000);

            if (1 < diffDays) {
               this.activity[i].createdOn = diffDays + "d";
            } else if (1 <= diffHrs) {
               this.activity[i].createdOn = diffHrs + "h";
            } else {
               this.activity[i].createdOn = diffMins + "m";
            }
         }
      } else {
         var len = this.reqData.length;
         for (var i = 0; i < len; i++) {
            var post = this.reqData[i].statusDate;
            var poston = Number(post);
            var postdate = new Date(poston);
            var currentdate = new Date();
            var timeDiff = Math.abs(postdate.getTime() - currentdate.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var diffHrs = Math.round((timeDiff % 86400000) / 3600000);
            var diffMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
            if (1 < diffDays) {
               this.reqData[i].statusDate = diffDays + "d";
            } else if (1 <= diffHrs) {
               this.reqData[i].statusDate = diffHrs + "h";
            } else {
               this.reqData[i].statusDate = diffMins + "m";
            }
         }
      }

   }

   memberprofile(item: any): void {
      var personname = item.membername;
      var username = localStorage.getItem('username');
      if (username == personname) {
         this._router.navigate(['profile']);
      }
      else {
         let link = ['', personname];
         this._router.navigate(link);
      }
      this.blur_close = false;
   }

   memberprofileactivity(item: any, i: any): void {
      var person_name = item.membername;
      var personname = item.username;
      var postId = item.postId;
      if (postId) {
         if (i == 3) {
            console.log(person_name, postId);
            let link = ['', person_name, postId];
            this._router.navigate(link);
         }
         else {
            console.log(personname, postId);
            let link = ['', personname, postId];
            this._router.navigate(link);
         }

      }
      else {
         let link = ['', person_name];
         this._router.navigate(link);
      }
      // var username = localStorage.getItem('username');
      // if (username == personname) {
      //     this._router.navigate(['profile']);
      // }
      // else {
      //     let link = ['person', personname];
      //     this._router.navigate(link);
      // }
      this.blur_close = false;
   }


   memberprofilehashtag(item: any): void {
      var personname = item.hashTagName;
      var username = localStorage.getItem('username');
      let link = ['caption', personname];
      this._router.navigate(link);
      this.blur_close = false;
   }

   memberprofilelocation(item: any): void {
      var personname = item.placename;
      var username = localStorage.getItem('username');
      let link = ['location', personname];
      this._router.navigate(link);
      this.blur_close = false;
   }



   onKey(value: string, limit: any, offset: any) {
      this.values = value;
      if (this.values.charAt(0) == '#') {
         var hashtag_regexp = /#([a-zA-Z0-9_]+)/g;
         this.values = this.values.replace(hashtag_regexp, '$1');
         // console.log(search_text);
         this._headerService.searchpeople(this.values, this.limit, this.offset)
            .subscribe((res) => {
               this.search_person = false;
               this.search_hashtag = true;
               this.search_location = false;
               this.data = res.data;
               if (res.data.userData[0]) {
                  this.userData = res.data.hashTagData[0].hashTagName;
               }
            });

      } else if (this.values.charAt(0) == '@') {
         var hashtag_regexp = /@([a-zA-Z0-9_]+)/g;
         this.values = this.values.replace(hashtag_regexp, '$1');
         // console.log(search_text);
         this._headerService.searchpeople(this.values, this.limit, this.offset)
            .subscribe((res) => {
               this.search_person = true;
               this.search_hashtag = false;
               this.search_location = false;
               this.data = res.data;
               if (res.data.userData[0]) {
                  this.userData = res.data.userData[0].membername;
               }
            });
         this._headerService.searchproduct(this.values, this.limit, this.offset)
            .subscribe((res) => {
               console.log("res product");
               console.log(res);
               this.search_product = true;
               this.dataPro = res.data;

            });
      } else {
         this._headerService.searchpeople(this.values, this.limit, this.offset)
            .subscribe((res) => {
               this.search_person = true;
               this.search_hashtag = true;
               this.search_location = true;
               this.data = res.data;
               if (res.data.userData[0]) {
                  this.userData = res.data.userData[0].membername;
               }
               //  console.log(res.data.userData[0].membername);
            });
         this._headerService.searchproduct(this.values, this.limit, this.offset)
            .subscribe((res) => {
               console.log("res product");
               console.log(res);
               this.search_product = true;
               this.dataPro = res.data;

            });

      }


   }
   usersearchSubmit(value: any, data: any) {
      // console.log(this.userData);
      var searchname = this.userData;
      if (value.charAt(0) == '#') {
         let link = ['caption', searchname];
         this._router.navigate(link);
         this.blur_close = false;
      } else if (value.charAt(0) != '#') {
         if (searchname) {
            let link = ['', searchname];
            this._router.navigate(link);
            this.blur_close = false;
         } else {
            let link = ['', value];
            this._router.navigate(link);
            this.blur_close = false;
         }
      }
   }

   blursearch() {
      // alert("hai");
      setTimeout(() => {
         jQuery("#searchPico").val('');
         this.blur_close = false;
      }, 200);
   }
   searchopen() {
      // alert("hi");
      this.blur_close = true;
   }
   logout() {
      // this._profileService.logout();
      var token = localStorage.removeItem('authToken');
      var username = localStorage.removeItem('username');
      this._router.navigate(['login']);
   }
   login(a: any) {
      this.dataObj['active'] = a;
      jQuery("#loginModal").modal('show');
   }

   seeReq() {
      localStorage.setItem('notify', '1');
      this._router.navigate(['settings']);
   }

   gotToProduct(data: any) {
      let link = [data.owner.username + '/shop/', data.postId];
      this._router.navigate(link);
   }

   /*****************Accept/Reject User Follow Request************************ */
   acceptRejectReqFun(action: any, item: any,indx:any) {
     console.log(item);
      var data = {
         action: action,
         membername: item.membername,
      }
      console.log(data);
      this._headerService.acceptRejectReq(data)
         .subscribe((res) => {
            console.log("res req");
            console.log(res);
               if(res.code==200){
                 if(action==0){
             this.activity[indx].requestStatus=2;
            }
            else{
             this.activity[indx].requestStatus=1; 
            }
            }
         
         });
   }
      /*****************Accept/Reject User Follow Request************************ */
   acceptSponReqFun(item: any,indx:any) {
     console.log(item);
      var data = item.username;
      console.log(data);
      this._headerService.approvesSponsor(data)
         .subscribe((res) => {
               if(res.code==200){
               this.reqData[indx].requestStatus=1;
            }
         });
   }
     rejectSponReqFun(item: any,indx:any) {
     console.log(item);
      var data = item.username;
      this._headerService.declineSponsor(data)
         .subscribe((res) => {
            if(res.code==200){
               this.reqData[indx].requestStatus=2;
            }
             
         });
   }

   /**================Validate Image Url======================= */
 checkImgURL(url:string) {
    if(url){
   if(url.match(/\.(jpeg|jpg|gif|png)$/) ==null){
     url="/public/images/user.jpg"

   }
    }
    return url;
 }
}