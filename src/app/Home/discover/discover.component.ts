import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router, ActivatedRoute  } from '@angular/router';
import {DiscoverpeopleService} from '../discover/discover.service';
import { Observable } from 'rxjs/Observable';
import {HeaderComponent} from '../../header/header.component';
declare const jQuery: any;
declare const FB:any;
import { CeiboShare } from 'ng2-social-share';
import { InfiniteScroll } from 'angular2-infinite-scroll';
import { Location } from '@angular/common';
import {listService} from './../list/list.service';
import {TruncatePipe} from '../../pipes/truncate.pipe';
import {Clipboard} from 'ts-clipboard';
import { UrlToImageService } from '../../sharedServices/urlToimage.service';
@Component({
    selector: 'discover',
    templateUrl: '/discover.component.html',
    directives: [ROUTER_DIRECTIVES, HeaderComponent, CeiboShare,InfiniteScroll],
    pipes: [TruncatePipe],
    providers: [DiscoverpeopleService, listService, UrlToImageService]
})

export class DiscoverComponent {


    private name: string;
    private data: any;
    private posts: any = [];
    private mData: any = [];
    private sampleUrl: any = [];
    private twtrText = '';
    private loading = true;
    private buffer = false;
    private buffer_slider=false;
    private cuserData:any = [];
    showTagLabel=false;
    username: any;
    commnentdetails: any = [];
    submitComment:any;
    flag:boolean = false
    actives: any = {
        f: false,
        i: false,
        t: false
    }
    comment: string = '';
    textareaLength: number = 120;
    repoUrl: string = '';
    activeitem2:any;
    newListname = '';
    private userLists:any = [];
    private aind = 0;
    constructor(private _personService: DiscoverpeopleService, private _router: Router, private route: ActivatedRoute,private location:Location,  private _listService:listService,
        private _uTiService:UrlToImageService) {
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
    private privatemember: any;
    totaldata: any;
    commentdata: any;
    persondata = false;
    personnodata =false;
    lcount: any;
    namelen:any;
    sponLen:boolean=true;
    isLogin:boolean=false;
    isExist:boolean=false;
    sPostId:any;
    createdBy:any;
    mdata:any;
    cntry:string;
    rgn:string;
    city:string;
    id:any;
    onTagClick:boolean=false;
      isCopied:boolean = false;
    ngOnInit() {
    
        jQuery(".modal-backdrop").css({ "display": "none" });
        var token = localStorage.getItem('authToken');
        var username = localStorage.getItem('username');
        this.username = username;
            this.name =  this.username;
            this.loading = true;
            if((token)){
            this._personService.getExplore()
                .subscribe((res) => {
                    console.log("yes check it here");
                    console.log(res);
                    console.log("its above");
                      this.loading = false;
                    if(res.code == 2949){
                      this.persondata = false;
                      this.personnodata =true;
                       this.posts=[];
                    }
                     if(res.code == 200){
                        
                        this.persondata = true;
                        this.personnodata =false;
                      
                        this.posts=[];
                        this.totaldata = res.data;
                        this.offset = res.data.length;
                        this.commentfunction();
                        if (this.offset >= 20)
                            this.loadmoree = true;
                     }
                });
                // this._listService.getUserList(username)
                // .subscribe((res) => {
                //     this.userLists = res;
                // });
            }
            else{
                  this._router.navigate(["login"]);
            }
         

        jQuery(document).keyup(function (e: any) {
            if (e.keyCode == 27) {
                jQuery(".modal").css({ "display": "none" });
                jQuery(".modal-backdrop").css({ "display": "none" });
            }
        });
     
        jQuery(window).on('popstate', (e: any, chip:any) => { 
            this.lcount=2;
           if(!this.isExist){
                jQuery("#myModalc2").modal('hide');
           }
           
        });
         jQuery(window).on('popstate', (e: any, chip:any) => { 
                        jQuery("#myModalc2").modal('hide');
        });
         
        jQuery(document).on('hidden.bs.modal','#myModalc2', (e: any, chip:any) => {
              var newurl = window.location.protocol + "//" + window.location.host +'/explore';
              window.history.pushState(null,null,newurl);
            
        })
   
        jQuery(document).on('hidden.bs.modal','#myModal_list', (e: any, chip:any) => {
              jQuery("#hideShowLable").css({'width':'100%'});
        })

        // jQuery('body').on('click', '#facebook2', ()=> {
            
        // });
    }

    fbShare() {
        var ind = this.aind;
            var cap = '';
            for(var i=0; i<this.posts[ind].postCaption.length; i++) {
                if(i == 0){
                    cap = this.posts[ind].postCaption[i]
                } else {
                    cap = cap + " "+ this.posts[ind].postCaption[i];
                }
            }
            
            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.shares',
                action_properties: JSON.stringify({
                    object : {
                        'og:url': this.repoUrl,
                        'og:title': this.posts[ind].postedByUserName  + ' (' +  this.posts[ind].postedByUserFullName + ')' + 'on Merriment.io',
                        'og:description':cap,
                        'og:image:url': this.posts[ind].mainUrl,
                        'og:image:width': '1920',
                        'og:image:height': '1200',
                    }
                })
                }, (response:any)=>{

                });
    }
    
    hashtagFunction(){
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
              this.hashtagFunction(); 
        var len = this.totaldata.length;        
        for (var i = 0; i < len; i++) {
          
            this.totaldata[i].description=this.totaldata[i].postCaption;
            var postCaption: any = [];
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

             var usersTaggedInPosts: any = [];
            if (this.totaldata[i].usersTaggedInPosts) {
                usersTaggedInPosts = this.totaldata[i].usersTaggedInPosts.split(',');
                this.totaldata[i].usersTaggedInPosts = usersTaggedInPosts;
            }

            var taggedUserCoordinates: any = [];
            if (this.totaldata[i].taggedUserCoordinates && this.totaldata[i].taggedUserCoordinates.indexOf("[[") >= 0 && this.totaldata[i].taggedUserCoordinates != 'undefined') {
                taggedUserCoordinates = JSON.parse(this.totaldata[i].taggedUserCoordinates || null);
                this.totaldata[i].taggedUserCoordinates = taggedUserCoordinates;
            }
      
            var sponProductCoordinates: any = [];
            if (this.totaldata[i].sponProductCoordinates && this.totaldata[i].sponProductCoordinates.indexOf("[[") >= 0 && this.totaldata[i].sponProductCoordinates != 'undefined') {
                sponProductCoordinates = JSON.parse(this.totaldata[i].sponProductCoordinates || null);
                this.totaldata[i].sponProductCoordinates = sponProductCoordinates;
            }
            if (usersTaggedInPosts && taggedUserCoordinates) {
                var lenn = usersTaggedInPosts.length;
                var tagsCords: any = [];
                for (var j = 0; j < lenn; j++) {
                    var userCords = {
                        name: usersTaggedInPosts[j],
                        right: 0,
                        top: 598,
                    };
                    tagsCords.push(userCords);
                }

            }
           if (this.totaldata[i].sponProducts && this.totaldata[i].sponProducts.length > 0) {
                var lenn = this.totaldata[i].sponProducts.length;
                var tagsCords: any = [];
                for (var j = 0; j < lenn; j++) {
                    var productCords = {
                        name: this.totaldata[i].sponProducts[j].owner.username,
                        right: 0,
                        top: 598,
                        imageUrl: this.totaldata[i].mainUrl,
                    };
                    tagsCords.push(productCords);
                }

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
        console.log(this.posts);
        // this.posts = this.totaldata;
    }


    loadmore() {
        this.offset = this.posts.length;
        this._personService.loadmore(this.offset, this.name)
            .subscribe((res) => {
                this.totaldata = res.data;
                this.commentfunction();

                this.offset = res.data.length || 0;
                if (this.offset >= 20)
                    this.loadmoree = true;
                else
                    this.loadmoree = false;
            });
    }

    timepost(item: any) {
         if (this.isLogin) {
             this.sharePostlogin();
        } else {
        var postsId = item.postId;
        var followingUsername = this.name;
        let link = ['', followingUsername, postsId];
        this._router.navigate(link,{ queryParams: {}});
        }
    }

   usertagged(i: any) {
       console.log(this.posts[i]);
     if(this.posts[i].usertaggedFlagg==false || !this.posts[i].usertaggedFlagg){
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
                         userCords.top = getHeight - str2 ;
                         userCords.top=userCords.top-5;
                         if (right > getWidth / 2) {
                            userCords.isRight = true;
                            userCords.right = getWidth -right;  
                            userCords.right=userCords.right-10;
                        }
                        else {
                            userCords.right = right;   
                              userCords.right=userCords.right-10;
                        }
                    }
                    tagsCords.push(userCords);
                }
            }

        }
        if (this.posts[i].sponProducts && this.posts[i].sponProducts.length > 0) {
            var lenn = this.posts[i].sponProducts.length;
           if(lenn>0){
                jQuery("#pp_"+this.posts[i].postId).slideToggle("fast");
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
                console.log(productCords);
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
                      this.posts[i].isThumb=true;
                    tagsCords.push(productCords);
                }
            }
        }
        this.posts[i].coords = tagsCords;
        this.posts[i].usertaggedFlagg = true;
    }
    else{
         this.showTagLabel=false;
        this.posts[i].usertaggedFlagg = false;
          if(this.sponLen==false){
               this.sponLen=true;
             jQuery("#pp_"+this.posts[i].postId).slideToggle("fast");
             }
    }
     
    }

    usertaggedname(tagged: any): void {
          jQuery('.modal').modal('hide');
          jQuery(".modal-backdrop").css({ "display": "none" });
          jQuery("#myModalc2").css({ "display": "none" });
          this.onTagClick=true;
        if (this.isLogin) {
             this.sharePostlogin();
        } else {
        if(tagged.pId){
          let link = ['', tagged.uname,'shop',tagged.pId];
                 localStorage.setItem("cretedBy", this.name);
                 this._router.navigate(link, { queryParams: { postId: this.id}});
        }
        else{
        var personname = tagged.name;
        var username = localStorage.getItem('username');
                let link = ['', personname];
                 localStorage.setItem("cretedBy", this.name);
                 this._router.navigate(link, { queryParams: { postId: this.id}});
        }
        } 
    }
  sharePostlogin() {
        this._router.navigate(['login'], { queryParams: { returnUrl: this.location.path()}});
    }

    activeitem(id: any,type:any,i:any,data:any) {
        this.aind = i;
        if(!this.onTagClick){
        this.id=id;
         var urlchunks = window.location.pathname.split('/');
        var username = urlchunks[1];
        if(type==1){
           if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host +'/'+ data.postedByUserName + '/'+id;
            var backurl = window.location.protocol + "//" + window.location.host +'/explore';
            window.history.pushState(null,null,newurl);
        }
        jQuery('.item').removeClass("active");
        jQuery('#' + id + 'w').addClass("active");
    }
    else{
         let link = ['', username,id];
            this._router.navigate(link);
    }
        }
      
     

    }

    memberprofile(item: any): void {
           jQuery('.modal').modal('hide');
          jQuery(".modal-backdrop").css({ "display": "none" });
         if (this.isLogin) {
             this.sharePostlogin();
        } else {
        var personname = item.postedByUserName;
        var username = localStorage.getItem('username');
        if (username == personname) {
            this._router.navigate(['profile'],{ queryParams: {}});
        }
        else {
            let link = ['', personname];
            this._router.navigate(link,{ queryParams: {}});
        }
        }
        // let link = ['/person', item.username];
        // this._router.navigate(link);
    }
    memberprofilee(comment: any): void {
        if (this.isLogin) {
             this.sharePostlogin();
        } else {
        var personname = comment.commentedByUser;
        var username = localStorage.getItem('username');
        if (username == personname) {
            this._router.navigate(['profile'],{ queryParams: {}});
        }
        else {
            let link = ['', personname];
            this._router.navigate(link,{ queryParams: {}});
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
        this._router.navigate(link,{ queryParams: {}});
        }
    }

    membercaptionn(comment: any): void {
         if (this.isLogin) {
             this.sharePostlogin();
        } else {
        var hashtagname = comment[1].split('#');
        //   console.log(hashtagname[1]);        
        let link = ['caption', hashtagname[1].replace(" ", "")];
        this._router.navigate(link,{ queryParams: {}});
        }

    }

    memberprofilecaption(comment: any): void {
          if (this.isLogin) {
             this.sharePostlogin();
        } else {
        var personname = comment[1].split('@');
        var username = localStorage.getItem('username');
        if (username == personname[1]) {
            this._router.navigate(['profile'],{ queryParams: {}});
        }
        else {
            let link = ['', personname[1].replace(" ", "")];
            this._router.navigate(link,{ queryParams: {}});
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
            this._router.navigate(['profile'],{ queryParams: {}});
        }
        else {
            let link = ['', personname[1].replace(" ", "")];
            this._router.navigate(link,{ queryParams: {}});
        }
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
            this._router.navigate(['profile'],{ queryParams: {}});
        }
        else {
            let link = ['', personname];
            this._router.navigate(link,{ queryParams: {}});
        }
        }
    }

    likedoubleClick(id: any, postsType: any, i: number) {
          if (this.isLogin) {
             this.sharePostlogin();
        } else {
        if (this.posts[i].likeStatus == 0) {
            this.posts[i].likeheartFlagg = true;
            var username = localStorage.getItem('username');
            this.posts[i].postLikedBy.unshift(username);
            this.posts[i].likeStatus = 1;
            this.posts[i].likes += 1;
            this._personService.userlike(id, postsType)
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
        var username = localStorage.getItem('username');
        this.posts[i].postLikedBy.unshift(username);
        this.posts[i].likeStatus = 1;
        this.posts[i].likes += 1;
        this._personService.userlike(id, postsType)
            .subscribe();
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
        }
    }
    likedeactive(id: any, postsType: any, i: number) {
        if (this.isLogin) {
             this.sharePostlogin();
        } else {
        var username = localStorage.getItem('username');
        var array = this.posts[i].postLikedBy;
        var index = array.indexOf(username);
        if (index > -1) {
            array.splice(index, 1);
        }
        this.posts[i].likeStatus = 0;
        this.posts[i].likes -= 1;
        this._personService.userunlike(id, postsType)
            .subscribe();
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
        }

    }

  
    followingfllag(data: any, i: number) {
        if (this.isLogin) {
             this.sharePostlogin();
        } else {
        this.buffer = true;
         this.buffer_slider = true;
        if (data.isPrivate == 1) {
            setTimeout(() => {
                this.posts[i].followStatus = 0;
            }, 500);
            this._personService.privateprofile( this.posts[i].postedByUserName, data.isPrivate)
                .subscribe();
            setTimeout(() => {
                this.buffer = false;
            this.buffer_slider = false;
            }, 500);
        }
        if (data.isPrivate != 1) {
            setTimeout(() => {
                this.posts[i].followStatus = 1;
            }, 500);
            this._personService.following(this.posts[i].postedByUserName)
                .subscribe();
            setTimeout(() => {
                this.buffer = false;
                this.buffer_slider = false;
            }, 500);
        }
        }

    }

    followfllag(data: any, i: number) {
          if (this.isLogin) {
             this.sharePostlogin();
        } else {
         this.buffer = true;
         this.buffer_slider = true;
        setTimeout(() => {
            this.posts[i].followStatus = null;
        }, 500);
        this._personService.follow(this.posts[i].postedByUserName)
            .subscribe();
        setTimeout(() => {
             this.buffer = false;
             this.buffer_slider = false;
        }, 500);
        }

    }



    left(data:any) {
        var strid = jQuery('.item.active').prev().attr("id")
          if(!strid){
          var strid =  jQuery('.item:last').attr("id")
        }
        if(strid){
            var id = strid.substr(0, strid.length -1);
            var data= this.posts.filter(function (item: any) {
                 if(item.postId==id){
                    return item;
                 }
            });
        if (history.pushState) {
            var str = window.location.pathname;
            var backurl = window.location.protocol + "//" + window.location.host + '/explore';
            var newurl = window.location.protocol + "//" + window.location.host + '/' + data[0].postedByUserName + '/' + id;      
             
             this.lcount=0;
          //  window.history.pushState(null,null,newurl);
            window.history.replaceState(null,null,newurl);
        }
        }
        
    }


    right(data:any) {
        var strid = jQuery('.item.active').next().attr("id")
        if(!strid){
          var strid = jQuery('.item:first').attr("id")
        }
        if(strid){
            var id = strid.substr(0, strid.length -1);
               var data= this.posts.filter(function (item: any) {
                 if(item.postId==id){
                    return item;
                 }
            });
        if (history.pushState) {
            var str = window.location.pathname;
            var backurl = window.location.protocol + "//" + window.location.host + '/explore';
            var newurl = window.location.protocol + "//" + window.location.host + '/' + data[0].postedByUserName + '/' + id;      
            //window.history.pushState({path:backurl},'',backurl);
            this.lcount=0;
            window.history.replaceState(null,null,newurl);
        }
        }
        
       
    }
     postCaption:any='Share your posts at merriment.io'
     imageUrl:any="http://merriment.io/public/images/pico_logo_new.png";
    shareFun(item:any) {
          if (this.isLogin) {
             this.sharePostlogin();
        } else {
         this.imageUrl=item.mainUrl;
         this.postCaption=item.description;
        var url = window.location.protocol+"//"+ window.location.host + window.location.pathname+'?ref='+ this.username;
        this._personService.shortUrl(url)
        .subscribe((res) => {
            this.repoUrl = res.shorturl;
            console.log(res);
        });
        }
    }

    activeFun(s: string) {
        if(s == 'f'){
            this.actives.f = !this.actives.f;
        } else if (s == 'i') {
            this.actives.i = !this.actives.i;
        } else {
            this.actives.t = !this.actives.t;
        }
    }




      showAddList() {
        jQuery("#hideShowLable").css({'width':'0'});
    }
    getActiveID(id: any){
    
          if (this.isLogin) {
        this.sharePostlogin();
        } else {
        this.activeitem2 = id;
        this.getListInfo(id);
        console.log(id);
        }
    }
    addnewlist(){
        console.log(this.newListname);
        this._listService.createList(this.username, this.newListname)
        .subscribe((res) => {
            if(res.code == 200) {
                this.getListInfo(this.activeitem2);
            }
        })
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

    addToList(listID:any, sel:any, ui:any) {
        var postID = this.activeitem2;
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

    twitterShare() {
        jQuery('#twtrShare').modal('show');
        jQuery('#myModall').modal('hide');
        this.twtrText = this._uTiService.setTwitterText(this.posts[this.aind], this.repoUrl);
    }
    tweet() {
        var file = this.posts[this.aind].mainUrl
        this._uTiService.previewFile(file, this.twtrText);
    }

}