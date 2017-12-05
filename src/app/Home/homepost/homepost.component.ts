import { Component, animate, style, state, transition, trigger } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { homepostService } from '../homepost/homepost.service';
import { Observable } from 'rxjs/Observable';
import { HeaderComponent } from '../../header/header.component';
import { ModalComponent } from '../../Publiclogin/modal.component';
declare const jQuery: any;
declare const FB: any;
declare const twttr: any;
import { CeiboShare } from 'ng2-social-share';
import { Location } from '@angular/common';
import {listService} from './../list/list.service';
import {TruncatePipe} from '../../pipes/truncate.pipe';
import {AuthService} from '../../sharedServices/AuthService/auth.service';
import { reportService } from '../../reportServices/report.service';
import {Clipboard} from 'ts-clipboard';
import { UrlToImageService } from '../../sharedServices/urlToimage.service';


@Component({
    selector: 'homepost',
    templateUrl: '/homepost.component.html',
    directives: [ROUTER_DIRECTIVES, HeaderComponent, CeiboShare,ModalComponent],
    providers: [homepostService, listService,reportService, UrlToImageService],
     pipes: [TruncatePipe],
    styles: [`
     @media only screen and (min-width: 768px) {
    .insta {
        display:none!important;
    }
}
  `],
})

export class HomepostComponent {
    private name: string;
    private id: number;
    private data: any;
    private posts: any = [];
    private loading = true;
    private buffer = false;
    private sharePost = false;
    submitComment: any;
    showTagLabel=false;
    actives: any = {
        f: false,
        i: false,
        t: false
    }
    private twtrText = '';
    comment: string = '';
    textareaLength: number = 120;
    repoUrl: string = '';
    newListname = '';
    private userLists:any = [];
    private mainUrl:any = '';
    constructor(private _homepostService: homepostService, private _router: Router, private route: ActivatedRoute,
    private location:Location, private _listService:listService,private _reportService:reportService, private _uTiService:UrlToImageService) {
        FB.init({
            appId: '152854238613410',
            status:true,
            cookie: true,  // enable cookies to allow the server to access 
            version: 'v2.10' // use graph api version 2.5 
        });
    }

    private offset = 0;
    private loadmoree: any;
    private data1: any;
    private data2: any;
    username: any;
    totaldata: any;
    private privatemember: any;
    commentdata: any;
    commnentdetails: any = [];
    sponLen:boolean=true;
    state:string='closed';
    isLogin:boolean=false;
    isCopied:boolean = false;
    ownerRight:boolean=true
    isThumb:boolean=false;
    isOwner:boolean=true;
    updateUrl:any
    dataObj:any={};
    rep_inapp:string="Report inappropriate";
    rep_spam:string="Report spam";
    ngOnInit() {
      
    jQuery(".modal-backdrop").css({ "display": "none" });
            this.route.params.subscribe(params => {
            this.name = params['name'];
            this.id = params['id'];
            this.loading = true;
            var token = localStorage.getItem('authToken');
            var username = localStorage.getItem('username');
            this.username = username;
            if (!token) {
                var url = this.location.path();
                this.isLogin=true;
                this._homepostService.getPublicPost(this.id)
                    .subscribe((res) => {
                        this.sharePost=true;
                       this.loading = false;
                       if( res.data[0].isSponsoredPost==1){
                           this.dataObj['referrer'] =res.data[0].username;
                             localStorage.setItem('refrer', url.split('?ref=')[1]);
                            this.sharePostlogin();
                       }
                       else{
                         if(url.indexOf('?ref=')>=0){
                            this.dataObj['referrer'] = url.split('?ref=')[1]; 
                             localStorage.setItem('refrer',  this.dataObj['referrer']);
                            this.sharePostlogin();
                         }
                       }  
                      

                        if(res.data[0].username == this.name){
                         this.posts = [];
                         this.totaldata = res.data;
                          this.commentfunction();
                         }
                         else{
                             this.ownerRight=false;
                         }
                    });
            } else {
                this._homepostService.getPost(this.id)
                    .subscribe((res) => {
                       this.loading = false;
                        console.log(res);
                         console.log("above");
                         if(res.data[0].postedByUserName == this.name){
                         this.posts = [];
                         this.totaldata = res.data;
                          this.commentfunction();
                         }
                         else{
                             this.ownerRight=false;
                         }
                    });
                // this._listService.getUserList(this.username)
                // .subscribe((res) => {
                //     this.userLists = res;
                // })
            }
        
        });

        jQuery(document).on('hidden.bs.modal','#myModal_list', (e: any, chip:any) => {
              jQuery("#hideShowLable").css({'width':'100%'});
        })

        // jQuery('body').on('click', '#facebook3', ()=> {
            
        // });

    }

    //Get the latitude and the longitude;
   
    fbShare() {
        console.log('inside click');
            console.log(this.posts);
            var cap = '';
            for(var i=0; i<this.posts[0].postCaption.length; i++) {
                if(i == 0){
                    cap = this.posts[0].postCaption[i]
                } else {
                    cap = cap + " "+ this.posts[0].postCaption[i];
                }
            }

            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.shares',
                action_properties: JSON.stringify({
                    object : {
                        'og:url': this.repoUrl,
                        'og:title': this.posts[0].postedByUserName  + ' (' +  this.posts[0].postedByUserFullName + ')' + 'on Merriment.io',
                        'og:description':cap,
                        'og:image:url': this.posts[0].mainUrl,
                        'og:image:width': '1920',
                        'og:image:height': '1200',
                    }
                })
                }, (response:any)=>{

                });
    }
     

    hashtagFunction() {
        var len = this.totaldata.length;
        for (var i = 0; i < len; i++) {
            if (this.totaldata[i].commentData) {
                var commenttext = this.totaldata[i].commentData;
                for (var x = 0; x < commenttext.length; x++) {
                    // commenttext.splice(x, 0);
                    if (this.totaldata[i].commentData[x].commentBody) {
                        var postCommentNodeArr1 = commenttext[x].commentBody;
                        // console.log(postCommentNodeArr1);
                        var hashtag_regexp = /#([a-zA-Z0-9_]+)/g;
                        var comment_text = postCommentNodeArr1.replace(
                            hashtag_regexp,
                            '<a href="caption/$1" class="hashtag member_name biohashtag">#$1</a>'
                        );
                        var hashtag_regexp1 = /@([a-zA-Z0-9_]+)/g;
                        var comment_textt = comment_text.replace(
                            hashtag_regexp1,
                            '<a href="$1" class="hashtag member_name biohashtag">@$1</a>'
                        );
                        this.totaldata[i].commentData[x].commentBody = comment_textt;
                    }
                }
            }
        }
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
    commentfunction() {
      //  this.hashtagFunction();
        // alert("hi");
        console.log(this.totaldata)
        var len = this.totaldata.length;
        for (var i = 0; i < len; i++) {
            if (this.totaldata[i].postId == this.id) {
                console.log("inside")
                console.log(this.totaldata[i])
          
            var postCaption: any = [];
            this.totaldata[i].description=this.totaldata[i].postCaption;
            if (this.totaldata[i].postCaption) {
                var postCaptionn = this.totaldata[i].postCaption.split(' ');
                this.totaldata[i].postCaption = postCaptionn;
            }

            var postLikedBy: any = [];
            if (this.totaldata[i].postLikedBy) {
                var liked = this.totaldata[i].postLikedBy.split(',');
                if (liked.length) {
                    this.totaldata[i].postLikedBy = liked;
                }
            } else {
                this.totaldata[i].postLikedBy = [];
            }
            // var usersTaggedInPosts: any = [];
             if (this.totaldata[i].usersTaggedInPosts !='undefined' && this.totaldata[i].usersTaggedInPosts) {
                this.totaldata[i].usersTaggedInPosts = this.totaldata[i].usersTaggedInPosts.split(',');
            }

            var taggedUserCoordinates: any = [];
            if (this.totaldata[i].taggedUserCoordinates && this.totaldata[i].taggedUserCoordinates.indexOf("[[") >= 0 && this.totaldata[i].taggedUserCoordinates != 'undefined' && this.totaldata[i].taggedUserCoordinates != 'undefined') {
                taggedUserCoordinates = JSON.parse(this.totaldata[i].taggedUserCoordinates || null);
                this.totaldata[i].taggedUserCoordinates = taggedUserCoordinates;
            }
            
            var sponProductCoordinates: any = [];
            if (this.totaldata[i].sponProductCoordinates && this.totaldata[i].sponProductCoordinates.indexOf("[[") >= 0 && this.totaldata[i].sponProductCoordinates != 'undefined') {
                sponProductCoordinates = JSON.parse(this.totaldata[i].sponProductCoordinates || null);
                this.totaldata[i].sponProductCoordinates = sponProductCoordinates;
            }
           var tagsCords: any = [];
            if (this.totaldata[i].usersTaggedInPosts !='undefined' && this.totaldata[i].usersTaggedInPosts) {
                var lenn = this.totaldata[i].usersTaggedInPosts.length;
                
                for (var j = 0; j < lenn; j++) {
                    var userCords = {
                        name: this.totaldata[i].usersTaggedInPosts[j],
                        right: 0,
                        top: 598,
                    };
                    tagsCords.push(userCords);
                }

            }
            if (this.totaldata[i].sponProducts && this.totaldata[i].sponProducts.length > 0) {
                     var lenn = this.totaldata[i].sponProducts.length;
                     var proImageArr:any=[];
                     for (var k = 0; k < lenn; k++) {
                        var productCords = {
                            imageUrl: this.totaldata[i].sponProducts[k].mainUrl,
                            name: this.totaldata[i].sponProducts[k].productName + ' by ' + this.totaldata[i].sponProducts[k].owner.username,
                            right: 0,
                            isRight: false,
                            uname: this.totaldata[i].sponProducts[k].owner.username,
                            pId:this.totaldata[i].sponProducts[k].postId,
                             price:this.totaldata[i].sponProducts[k].price !='undefined' ? this.totaldata[i].sponProducts[k].price : 0,
                        };
                        this.isThumb=true;
                        proImageArr.push(productCords);
                     tagsCords.push(productCords);
                     }
                   this.totaldata[i].proImage=proImageArr;
            }
            this.totaldata[i].coords = tagsCords;
            var post = this.totaldata[i].postedOn;
            var poston = Number(post);
            var postdate = new Date(poston);
            var currentdate = new Date();
            var timeDiff = Math.abs(postdate.getTime() - currentdate.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var diffHrs = Math.round((timeDiff % 86400000) / 3600000);
            var diffMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000);

            if (1 < diffDays) {
                this.totaldata[i].postedOn = diffDays + "d";
            } else if (1 <= diffHrs) {
                this.totaldata[i].postedOn = diffHrs + "h";
            } else {
                this.totaldata[i].postedOn = diffMins + "m";
            }
             var list=Number(this.totaldata[i].listsCount);
            let getListCount:any;
            if(list==0 ){
               getListCount='List';
            }
            else if(list==1){
               getListCount='1 list';
            }
            else if(list>1 && list<1000){
                  getListCount=list + ' lists';
            }
            else if(list>1000) {
                getListCount= (list/1000).toFixed(2) + 'K';
            } 
            else{
                getListCount='List'; 
            }
              this.totaldata[i].getListCount=getListCount;
            var likes=Number(this.totaldata[i].likes);
            let getCount:any;
            if(likes==0 ){
               getCount='Like';
            }
            else if(likes==1){
               getCount='1 like';
            }
            else if(likes>1 && likes<1000){
                  getCount=likes + ' likes';
            }
            else if(likes>1000) {
                getCount= (likes/1000).toFixed(2) + 'K';
            } 
            else{
                getCount='Like'; 
            }
              this.totaldata[i].getCount=getCount;
            this.posts.push(this.totaldata[i]); 
        }
    }
    this.mainUrl = this.posts[0].mainUrl;
    this.setMeta(this.posts[0].postedByUserName, this.posts[0].postCaption.toString(), this.posts[0].mainUrl);
        // this.posts = this.totaldata;
    }
    sharePostlogin() {
        this.dataObj['active'] ='0';
        jQuery("#loginModal1").modal('show');
    }
    sharePostlogin2(a:any) {
        this.dataObj['active'] = a;
        jQuery("#loginModal1").modal('show');
    }


    timepost(item: any) {
        if (this.isLogin) {
             this.sharePostlogin();
        } else {
            var postsId = item.postId;
            var followingUsername = this.name;
            let link = ['', followingUsername, postsId];
            this._router.navigate(link);
        }
    }

    usertagged(i: any) {
       
        console.log(this.posts[i])
        if (this.posts[i].usertaggedFlagg == false || !this.posts[i].usertaggedFlagg) {
             
            this.showTagLabel=true;
            var getID = i;
             var contWidth = jQuery("#" + getID).width();
        var contHeight = jQuery("#" + getID).height();
        var getWidth=contHeight*this.posts[i].containerRatio;
         var getHeight=contWidth/this.posts[i].containerRatio;
            var tagsCords: any = [];
            if (this.posts[i].usersTaggedInPosts[0] != 'undefined' && this.posts[i].taggedUserCoordinates[0] != null && this.posts[i].usersTaggedInPosts.length > 0 && this.posts[i].taggedUserCoordinates.length > 0) {
                var lenn = this.posts[i].usersTaggedInPosts.length;
                for (var j = 0; j < lenn; j++) {
                    var userCords = {
                        name: this.posts[i].usersTaggedInPosts[j],
                        right: 0,
                        top: 0,
                        isRight: false,
                    };
                    if (this.posts[i].taggedUserCoordinates[j]) {
                        if (this.posts[i].taggedUserCoordinates[j][0] && this.posts[i].taggedUserCoordinates[j][1]) {
                            //  this.namelen = ((this.data[i].usersTaggedInPosts[j].length-1)*2);
                            var str1 = this.posts[i].taggedUserCoordinates[j][0];
                            var right = str1 * getWidth;
                            var str2 = this.posts[i].taggedUserCoordinates[j][1];
                            str2 = str2 * getHeight;
                            userCords.top = getHeight - str2;
                            userCords.top = userCords.top - 5;
                            if (right > getWidth / 2) {
                                userCords.isRight = true;
                                userCords.right = getWidth - right;
                                userCords.right = userCords.right - 10;
                            }
                            else {
                                userCords.right = right;
                                userCords.right = userCords.right - 10;
                            }
                        }
                        tagsCords.push(userCords);
                    }
                }

            }
            if ( this.posts[i].sponProducts.length > 0) {
                var lenn = this.posts[i].sponProducts.length;
            
              if(lenn>0){
                    // jQuery("#showProduct").slideToggle("fast");
                  this.sponLen=false;
              }
                for (var k = 0; k < lenn; k++) {
                    var productCords = {
                        imageUrl: this.posts[i].sponProducts[k].mainUrl,
                        name: this.posts[i].sponProducts[k].productName + ' by ' + this.posts[i].sponProducts[k].owner.businessName,
                        right: 0,
                        top: getHeight,
                        isRight: false,
                        uname: this.posts[i].sponProducts[k].owner.username,
                        pId:this.posts[i].sponProducts[k].postId,
                         price:this.posts[i].sponProducts[k].price !='undefined' ? this.posts[i].sponProducts[k].price : 0,
                    };
                    if (this.posts[i].sponProductCoordinates[k]) {
                        if (this.posts[i].sponProductCoordinates[k][0] && this.posts[i].sponProductCoordinates[k][1]) {
                            var str1 = this.posts[i].sponProductCoordinates[k][0];
                            var right = str1 * getWidth;
                            var str2 = this.posts[i].sponProductCoordinates[k][1];
                            var top = str2;
                            productCords.top = getHeight - (top * getHeight);
                            productCords.top = productCords.top - 5;
                            if (right > getWidth / 2) {
                                productCords.isRight = true;
                                productCords.right = getWidth - (right + 10);
                            }
                            else {
                                productCords.right = right - 10;
                            }
                        }
                        tagsCords.push(productCords);
                    }
                }
            }
            this.posts[i].coords = tagsCords;
            this.posts[i].usertaggedFlagg = true;
        }
        else {
             this.showTagLabel=false;
              this.posts[i].usertaggedFlagg = false;
               if(  this.sponLen==false){
                    // jQuery("#showProduct").slideToggle("fast");
                  this.sponLen=true;
              }
           
        }
        //  this.calWidth(i)

    }
  
    // falseusertagged(i:any){
    //     this.posts[i].usertaggedFlagg = false; 
    // }

    usertaggedname(tagged: any): void {
        if (this.isLogin) {
             this.sharePostlogin();
        } else {
            if(tagged.pId){
            let link = ['', tagged.uname,'shop',tagged.pId];
            localStorage.setItem("cretedBy", this.name);
               this._router.navigate(link, { queryParams: { postId: this.id}});
                // this._router.navigate(link);
            }
            else{
              var personname = tagged.name;
            // var username = localStorage.getItem('username');
            // if (username == personname) {
            //     this._router.navigate(['profile']);
            // }
            // else {
                let link = ['', personname];
                 localStorage.setItem("cretedBy", this.name);
               this._router.navigate(link, { queryParams: { postId: this.id}});
                // this._router.navigate(link);
            // }
        }
        }
    }


    memberprofile(): void {
        if (this.isLogin) {
             localStorage.setItem('isOwner',this.name);
             this.sharePostlogin();
        } else {
            var personname = this.name;
            var username = localStorage.getItem('username');
            if (username == personname) {
                this._router.navigate(['profile']);
            }
            else {
                let link = ['', personname];
                this._router.navigate(link);
            }
        }
        // let link = ['/person', item.username];
        // this._router.navigate(link);
    }
    memberprofilee(comment: any): void {
        if (this.isLogin) {
            this.sharePostlogin();
        } else {
            // alert(item.postsId);
            var personname = comment.commentedByUser;
            var username = localStorage.getItem('username');
            if (username == personname) {
                this._router.navigate(['profile']);
            }
            else {
                let link = ['', personname];
                this._router.navigate(link);
            }
        }
        // let link = ['person', comment[0]];
        // this._router.navigate(link);
    }

    membercaption(caption: any): void {
        if (this.isLogin) {
               this.sharePostlogin();
        } else {
            var hashtagname = caption.split('#');
            //   console.log(hashtagname[1]);        
            let link = ['caption', hashtagname[1]];
            this._router.navigate(link);
        }
    }

    membercaptionn(comment: any): void {
        if (this.isLogin) {
               this.sharePostlogin();
        } else {
            var hashtagname = comment[1].split('#');
            //   console.log(hashtagname[1]);        
            let link = ['caption', hashtagname[1].replace(" ", "")];
            this._router.navigate(link);
        }

    }

    memberprofilecaption(comment: any): void {
        if (this.isLogin) {
               this.sharePostlogin();
        } else {
            var personname = comment[1].split('@');
            var username = localStorage.getItem('username');
            if (username == personname[1]) {
                this._router.navigate(['profile']);
            }
            else {
                let link = ['', personname[1].replace(" ", "")];
                this._router.navigate(link);
            }
        }

    }
    memberprofilecaptionn(caption: any): void {
        if (this.isLogin) {
               this.sharePostlogin();
        } else {
            var personname = caption.split('@');
            var username = localStorage.getItem('username');
            if (username == personname[1]) {
                this._router.navigate(['profile']);
            }
            else {
                let link = ['', personname[1].replace(" ", "")];
                this._router.navigate(link);
            }
        }

    }

    commentdelete(comment: any, id: any, postsType: any, i: number): void {
        if (this.isLogin) {
               this.sharePostlogin();
        } else {
            //  console.log(comment[0]+" ss "+comment[1]+" id "+id+" postsType "+postsType+" i "+i);
            postsType = postsType.toString();
            this.commnentdetails = ({ username: comment.commentedByUser, message: comment.commentBody, commentId: comment.commentId, id: id, postsType: postsType, i: i });
        }
    }

    commentmodaldelete(): void {
        if (this.isLogin) {
               this.sharePostlogin();
        } else {
            console.log(this.commnentdetails);
            var commentlist = this.commnentdetails;
            var commenttext = commentlist.message;

            var hashtag_regexp = /<a[^>]*>([^<]+)<\/a>/g;
            var comment_text = commenttext.replace(hashtag_regexp, '$1');
            //  console.log(commentlist.i);
            this.posts[commentlist.i].commentData.pop();
            this._homepostService.userdeletecomment({ username: commentlist.username, message: comment_text, commentId: commentlist.commentId, id: commentlist.id, postsType: commentlist.postsType })
                .subscribe();
        }
    }

    likeStatus(liked: any): void {
        if (this.isLogin) {
              this.sharePostlogin();
        } else {
            var personname = liked;
            // alert(personname);
            var username = localStorage.getItem('username');
            if (username == personname) {
                this._router.navigate(['profile']);
            }
            else {
                let link = ['', personname];
                this._router.navigate(link);
            }
        }
    }

    likedoubleClick(id: any, postsType: any, i: number) {
        if (this.isLogin) {
               this.sharePostlogin();
        } else {
            // alert(id+'aa'+'bb'+postsType+'cc'+i);
            if (this.posts[i].likeStatus == 0) {
                this.posts[i].likeheartFlagg = true;
                var username = localStorage.getItem('username');
                this.posts[i].postLikedBy.unshift(username);
                this.posts[i].likeStatus = 1;
                this.posts[i].likes += 1;
                this._homepostService.userlike(id, postsType)
                    .subscribe();
                setTimeout(() => {
                    this.posts[i].likeheartFlagg = false;
                }, 500);
            }
        }
    }

    likeactive(id: any, postsType: any, i: number) {
        if (this.isLogin) {
              this.sharePostlogin();
        } else {
            // alert(id);
            var username = localStorage.getItem('username');
            this.posts[i].postLikedBy.unshift(username);
            this.posts[i].likeStatus = 1;
            this.posts[i].likes += 1;
            var likes=Number(this.posts[i].likes);
            let getCount:any;
            if(likes==0 ){
               getCount='Like';
            }
            else if(likes==1){
               getCount='1 like';
            }
            else if(likes>1 && likes<1000){
                  getCount=likes + ' likes';
            }
            else if(likes>1000) {
                getCount= (likes/1000).toFixed(2) + 'K';
            } 
            else{
                getCount='Like'; 
            }
              this.posts[i].getCount=getCount;
            this._homepostService.userlike(id, postsType)
                .subscribe();
        }
    }
    likedeactive(id: any, postsType: any, i: number) {
        if (this.isLogin) {
               this.sharePostlogin();
        } else {
           
            this.posts[i].likeStatus = 0;
            this.posts[i].likes -= 1;
            var likes=Number(this.posts[i].likes);
            let getCount:any;
            if(likes==0 ){
               getCount='Like';
            }
            else if(likes==1){
               getCount='1 like';
            }
            else if(likes>1 && likes<1000){
                  getCount=likes + ' likes';
            }
            else if(likes>1000) {
                getCount= (likes/1000).toFixed(2) + 'K';
            } 
            else{
                getCount='Like'; 
            }
              this.posts[i].getCount=getCount;
            this._homepostService.userunlike(id, postsType)
                .subscribe();
        }

    }



    followingfllag(name: any, i: number) {
    
        if (this.isLogin) {
              this.sharePostlogin();
        } else {
        this.buffer = true;
        if (this.privatemember == 1) {
            setTimeout(() => {
                this.posts[i].followStatus = 0;
            }, 500);
            this._homepostService.following(name)
                .subscribe();
            setTimeout(() => {
                this.buffer = false;
            }, 500);
        }
        if (this.privatemember != 1) {
            setTimeout(() => {
                this.posts[i].followStatus = 1;
            }, 500);
            this._homepostService.following(name)
                .subscribe();
            setTimeout(() => {
                this.buffer = false;
            }, 500);
        }
        }

    }

    followfllag(name: any, i: number) {
         
        
        if (this.isLogin) {
               this.sharePostlogin();
        } else {
        this.buffer = true;
        setTimeout(() => {
            this.posts[i].followStatus = null;
        }, 500);
        this._homepostService.follow(name)
            .subscribe();
        setTimeout(() => {
            this.buffer = false;
        }, 500);
        }

    }

    usercommentSubmit(value: any, id: any, postsType: any, i: number) {
        if (this.isLogin) {
               this.sharePostlogin();
        } else {
            // console.log('you submitted value:', value, id, postsType, i);
            postsType = postsType.toString();
            var username = localStorage.getItem('username');

            var commenttext = value;
            var hashtag_regexp = /#([a-zA-Z0-9_]+)/g;
            var comment_text = commenttext.replace(
                hashtag_regexp,
                '<a href="caption/$1" class="hashtag member_name biohashtag">#$1</a>'
            );
            var hashtag_regexp1 = /@([a-zA-Z0-9_]+)/g;
            var comment_textt = comment_text.replace(
                hashtag_regexp1,
                '<a href="$1" class="hashtag member_name biohashtag">@$1</a>'
            );
            if (value.length > 0) {
                // this.posts[i].comments.push([username, comment_textt]);

                this._homepostService.usercomment({ message: value, id: id, postsType: postsType })
                    .subscribe((res) => {
                        this.submitComment = res.data;
                        this.posts[i].commentData.push(this.submitComment[0].commentData[0]);
                        this.hashtagFunction();
                    });
            }
        }
    }
        updatePost(){
        localStorage.setItem('fromUrl',window.location.pathname)
         this._router.navigate(this.updateUrl); 
    }
        deleteId:any;
    dltIndex:any;
    dltMsg:string="Are you sure you want to delete post?";
     dltType:any='warning';
     buffer_dlt:boolean=false;
    deletePost(){
     this.buffer_dlt=true;
        this._homepostService.deletePost(this.deleteId)
                .subscribe((res) => {
                  console.log(res);
               
                 this.dltMsg="Post deleted successfully.";
                 this.dltType='success';
                 this.buffer_dlt=false;
                   jQuery(".modal").fadeOut(1500);
                 jQuery(".modal-backdrop").css({ "display": "none" }).fadeOut(1500);
                   setTimeout(() => {
                    this._router.navigate(['profile']);
                 }, 2500);
                });
    }
       postCaption:any='Share your posts at merriment.io'
      imageUrl:any="http://merriment.io/public/images/pico_logo_new.png";
    shareFun() {
          if (this.isLogin) {
             this.sharePostlogin();
        } else {
             this.imageUrl=this.posts[0].mainUrl;
               this.postCaption=this.posts[0].description;
        if(this.posts[0].postedByUserName==this.username){
          this.isOwner=false;
           this.dltIndex=0;
          this.deleteId=this.posts[0].postId;
          this.updateUrl=  ['', 'updatepost/'+this.posts[0].postId];
         }
         else{
              this.isOwner=true;
         }
        var url = window.location.protocol + "//" + window.location.host + window.location.pathname+'?ref='+ this.username;
        this._homepostService.shortUrl(url)
            .subscribe((res) => {
                this.repoUrl = res.shorturl;
                console.log(res);
            });
        }
    }

    activeFun(s: string) {
        if (s == 'f') {
            this.actives.f = !this.actives.f;
        } else if (s == 'i') {
            this.actives.i = !this.actives.i;
        } else {
            this.actives.t = !this.actives.t;
        }
    } 
    copyToClipboard() {
         if(this.repoUrl==''){
              this.copyToClipboard() 
         }
         else{
         jQuery('.linkCopy').fadeIn('slow');
         Clipboard.copy(this.repoUrl);
           setTimeout(() => {
            jQuery('.linkCopy').fadeOut('slow');
           }, 1000);
         }

}
    showAddList() {
        jQuery("#hideShowLable").css({'width':'0'});
    }
    getActiveID(id: any){
         if (this.isLogin) {
        this.sharePostlogin();
        } else {
        this.getListInfo(id);
        console.log(id);
        }
    }
    addnewlist(){
        console.log(this.newListname);
        this._listService.createList(this.username, this.newListname)
        .subscribe((res) => {
            if(res.code == 200) {
                this.getListInfo(this.id);
            }
        })
    }

    addToList(listID:any, sel:any, ui:any) {
        var postID = this.id;
        var len = this.posts.length;
        var index = 0;
         for(var i=0; i<len; i++) {
             if(this.posts[i].postId == postID) {
                 index = i;
             }
         }
        if(sel == 0) {
            this._listService.addPostToList(listID,postID)
            .subscribe((res) => {
                console.log(res);
                if(res.code == 200) {
                    this.userLists[ui].selected = 1;
                    this.posts[index].listsCount += 1;
                       var list=Number(this.posts[index].listsCount);
            let getListCount:any;
            if(list==0 ){
               getListCount='List';
            }
            else if(list==1){
               getListCount='1 list';
            }
            else if(list>1 && list<1000){
                  getListCount=list + ' lists';
            }
            else if(list>1000) {
                getListCount= (list/1000).toFixed(2) + 'K';
            } 
            else{
                getListCount='List'; 
            }
              this.posts[index].getListCount=getListCount;
                    this.listStatus(index);
                }
            })
        }  else {
            this._listService.removePostFromList(listID,postID)
            .subscribe((res) => {
                console.log(res);
                if(res.code == 200) {
                    this.userLists[ui].selected = 0;
                    this.posts[index].listsCount -= 1;
                       var list=Number(this.posts[index].listsCount);
            let getListCount:any;
            if(list==0 ){
               getListCount='List';
            }
            else if(list==1){
               getListCount='1 list';
            }
            else if(list>1 && list<1000){
                  getListCount=list + ' lists';
            }
            else if(list>1000) {
                getListCount= (list/1000).toFixed(2) + 'K';
            } 
            else{
                getListCount='List'; 
            }
              this.posts[index].getListCount=getListCount;
                    this.listStatus(index);
                }
            })
        }
        
    }

    getListInfo(postID:any) {
        this._listService.getListInfo(this.username, postID)
        .subscribe((res) => {
            this.userLists = res;
            this.newListname = '';
        })
    }
    listStatus(index:any) {
        console.log(index)
        var len = this.userLists.length;
        var count=0;
        for(var i=0;i<len;i++) {
            if(this.userLists[i].selected == 1) {
                count++;
            }
        }
       if(count >= 1) {
            this.posts[index].listStatus = true;
        } else {
            this.posts[index].listStatus = false;
        }
    }
    setMeta(t:any,d:any,i:any){
        console.log('function called')
        jQuery("meta[name='twitter:title']").attr("content", t);
        jQuery("meta[name='twitter:description']").attr("content", d);
        jQuery("meta[name='twitter:image']").attr("content", i);
        setTimeout(() => {
            twttr.widgets.load()
        },1000)
        
    }
    goToPlace(place:any){
        console.log(place);
         if (this.isLogin) {
             this.sharePostlogin();
        } else {
      this._router.navigate(['location',place]);
        }
    }


 buffer_iapp:boolean=false;
 buffer_spam:boolean=false;
 reportPost(type:any){
         if(type==0){
             this.buffer_iapp=true;
         }
         else{
              this.buffer_spam=true;
         }
     let data:any={
          token:localStorage.getItem('authToken'),
          postId:this.posts[0].postId,
          reasonFlag:type
      }
        this._reportService.reportPost(data)
        .subscribe((res) => {
            console.log(res);
            if(res.code==200){
            if(type==0){
                 this.buffer_iapp=false;
                  this.rep_inapp="Reported";
                  jQuery(".inappropriate").addClass("reported");
            }
            else{
                  this.buffer_spam=false;
                 jQuery(".spam").addClass("reported")
                 this.rep_spam="Reported";
            }
        }
        else{
                if(type==0){
                 this.buffer_iapp=false;
                  this.rep_inapp=res.message;
                  jQuery(".inappropriate").addClass("reported");
            }
            else{
                  this.buffer_spam=false;
                 jQuery(".spam").addClass("reported")
                 this.rep_spam=res.message;
            }
        }
                setTimeout(() => {
                jQuery(".reported").removeClass('reported');
                    this.rep_inapp="Report inappropriate";
                     this.rep_spam="Report spam";
             }, 2000);  
                setTimeout(() => {
            
                   jQuery(".modal").fadeOut(1500);
                   jQuery(".modal-backdrop").css({ "display": "none" }).fadeOut(1500);
                      setTimeout(() => {
                   jQuery(".modal").modal('hide');  
             }, 1600);  
                    
             }, 1600);      
        })
  }

  twitterShare() {
        jQuery('#twtrShare').modal('show');
        jQuery('#myModall').modal('hide');
        this.twtrText = this._uTiService.setTwitterText(this.posts[0], this.repoUrl);
    }
    tweet() {
        var file = this.posts[0].mainUrl
        this._uTiService.previewFile(file, this.twtrText);
    }

}

