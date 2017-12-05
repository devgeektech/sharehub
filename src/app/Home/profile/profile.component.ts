import {Component} from '@angular/core';
import {ProfileService} from '../profile/profile.service';
import {listService} from './../list/list.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router } from '@angular/router';
import {HeaderComponent} from '../../header/header.component';
import { InfiniteScroll } from 'angular2-infinite-scroll';
import { CeiboShare } from 'ng2-social-share';
import { Location } from '@angular/common';
import {TruncatePipe} from '../../pipes/truncate.pipe';
import {Clipboard} from 'ts-clipboard';
import { UrlToImageService } from '../../sharedServices/urlToimage.service';
declare const jQuery: any;
declare const FB:any;
@Component({
    selector: 'profile',
    templateUrl: '/profile.component.html',
    directives: [ROUTER_DIRECTIVES, HeaderComponent,InfiniteScroll,CeiboShare],
     pipes: [TruncatePipe],
    providers: [ProfileService, listService, UrlToImageService]
})

export class ProfileComponent {

    private data: any;
    private data1: any;
    private data2: any;
    private posts: any = [];
    private token: any;
    private loading = true;
    showTagLabel=false;
    username:any;
    commnentdetails:any=[];
    flag:boolean = false;
    lcount:number;
    newListname = '';
    activePostID:any;
    actives: any = {
        f: false,
        i: false,
        t: false
    }
    private twtrText = '';
    private userLists:any = [];
    sponLen:boolean=true;
    constructor(private _profileService: ProfileService, private _router: Router, private _listService:listService,private location:Location,
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
    private userprofile_name: any;
    totaldata: any;
    commentdata: any;
    submitComment:any;
    namelen:any;
    isExist:boolean=false;
    repoUrl: string = '';
    id:any;
    onTagClick:boolean=false;   
      isCopied:boolean = false;
      activeitemId:any;
      private aind = 0;
     isOwner:boolean=true;
    updateUrl:any
    ngOnInit() {
    
        jQuery(".modal-backdrop").css({ "display": "none" });
        jQuery("#hideShowLable").css({'width':'100%'});
        var username = localStorage.getItem('username');
         this.username = username;
        var token = localStorage.getItem('authToken');
        if (!token)
            this._router.navigate(["login"]);
         var username = localStorage.getItem('username');
         this.userprofile_name = username;

        this._profileService.profile()
            .subscribe((res) => {
                 if(res.code == 9200){
                    var token = localStorage.removeItem('authToken');
                    var username = localStorage.removeItem('username');
                    this._router.navigate(['login']);
                }
                this.loading = false;
                this.data = res.memberProfileData[0];
                /** bio add tag**/
               var biotext = this.data.bio;
               if(biotext){
                var hashtag_regexp = /#([a-zA-Z0-9_]+)/g;
                var bio_detail = biotext.replace(
                        hashtag_regexp,
                        '<a href="caption/$1" class="hashtag member_name biohashtag">#$1</a>' 
                    );

                    var hashtag_regexpp = /@([a-zA-Z0-9_]+)/g;                
                    var bio_detaill = bio_detail.replace(
                        hashtag_regexpp,
                        '<a href="$1" class="hashtag member_name biohashtag">@$1</a>' 
                    );
               }
                this.data.bio =bio_detaill;

                // this.posts = res.data[1];
                this.posts=[];
                this.totaldata = res.memberPostsData;
                // var commenttext = res.memberPostsData.comments;               
                this.offset = res.memberPostsData.length;

                this.commentfunction();
                // console.log(this.offset);
                if (this.offset >= 20)
                    this.loadmoree = true;
            });

        this._profileService.userFollowing()
            .subscribe((res) => {
                this.data1 = res.result;
                this.loading = false;
            });

        this._profileService.userFollowers()
            .subscribe((res) => {
                this.data2 = res.followers;
                this.loading = false;
            });
        // this._listService.getUserList(username)
        // .subscribe((res) => {
        //     this.userLists = res;
        // })
            jQuery(document).keyup(function(e:any) {                
                if (e.keyCode == 27) { 
                    jQuery(".modal").css({"display":"none"});
                    jQuery(".modal-backdrop").css({"display":"none"}); 
                }
            });

        jQuery(window).on('popstate', (e: any, chip:any) => { 
                        jQuery("#myModalc").modal('hide');
        });
         
        jQuery(document).on('hidden.bs.modal','#myModalc', (e: any, chip:any) => {
              var newurl = window.location.protocol + "//" + window.location.host +'/profile';
              window.history.pushState(null,null,newurl);
            
        })

        // jQuery(document).on('shown.bs.modal','#myModalc', (e: any, chip:any) => {
        //      this.flag = false;
        // })

        jQuery(document).on('hidden.bs.modal','#myModal_list', (e: any, chip:any) => {
              jQuery("#hideShowLable").css({'width':'100%'});
        })

        // jQuery('body').on('click', '#facebook9', ()=> {
            
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
                        'og:title': this.data.username  + ' (' +  this.data.fullName + ')' + 'on Merriment.io',
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
        // this.posts = this.totaldata;  // this.posts = this.totaldata;
    }


    loadmore() {
        // console.log(this.offset);

        this.offset = this.posts.length;

        this._profileService.loadmore(this.offset)
            .subscribe((res) => {                
                // var len = res.data[1].length;
                // for (var i = 0; i < len; i++) {
                //     this.posts.push(res.data[1][i]);
                // }

               this.totaldata = res.memberPostsData;
                // var commenttext = res.memberPostsData.comments;               
            //   this.offset = res.memberPostsData.length;
                this.commentfunction();
                if (this.offset >= 20)
                    this.loadmoree = true;
                else
                    this.loadmoree = false;
            });
    }

    timepost(item:any){       
        var postsId = item.postId;
        var followingUsername = this.data.username;              
        let link = ['', followingUsername, postsId];
        this._router.navigate(link);
    }

     usertagged(i: any) {
             console.log(this.posts[i])
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
          jQuery("#myModalc").css({ "display": "none" });
          this.onTagClick=true;
        var name=localStorage.getItem('username');
        if(tagged.pId){
          let link = ['', tagged.uname,'shop',tagged.pId];
                 localStorage.setItem("cretedBy",name);
                 this._router.navigate(link, { queryParams: { postId: this.id}});
        }
        else{
        var personname = tagged.name;
        var username = localStorage.getItem('username');
                let link = ['', personname];
                 localStorage.setItem("cretedBy", name);
                 this._router.navigate(link, { queryParams: { postId: this.id}});
        }
    }


    logout() {
        // this._profileService.logout();
        var token = localStorage.removeItem('authToken');
        var username = localStorage.removeItem('username');
        this._router.navigate(['login']);
    }

    activeitem(id: any,type:any) {  
        //   if(!this.onTagClick){      
        this.id=id;
        this.activeitemId = id;
         var urlchunks = window.location.pathname.split('/');
        var username = localStorage.getItem('username');
        if(type==1){
           if (history.pushState) {

       

            var newurl = window.location.protocol + "//" + window.location.host +'/'+ username + '/'+id;

            var backurl = window.location.protocol + "//" + window.location.host +'/'+ username;
           // window.history.pushState({path:backurl},'',backurl);
            window.history.pushState(null,null,newurl);
        }
        jQuery('.item').removeClass("active");
        jQuery('#' + id + 'w').addClass("active");
    }
    else{
         let link = ['', username,id];
            this._router.navigate(link);
    }   
        //   }   

    }

   

memberprofile(item: any): void {
       jQuery('.modal').modal('hide');
          jQuery(".modal-backdrop").css({ "display": "none" });
        // alert(item.postsId);
    //    var personname = item.username;
    //    var username = localStorage.getItem('username');
    //    if(username == personname){
            this._router.navigate(['profile']);
            // }
            // else{
            //     let link = ['', personname];
            //     this._router.navigate(link);
            // }
        // let link = ['person', item.username];
        // this._router.navigate(link);
    }
memberprofilee(comment: any): void {
        // alert(item.postsId);
       var personname = comment.commentedByUser;
       var username = localStorage.getItem('username');
       if(username == personname){
            this._router.navigate(['profile']);
            }
            else{
                let link = ['', personname];
                this._router.navigate(link);
            }
        // let link = ['person', comment[0]];
        // this._router.navigate(link);
    }
    membercaption(caption: any): void {        
        var hashtagname = caption.split('#');
    //   console.log(hashtagname[1]);        
        let link = ['caption', hashtagname[1]];
        this._router.navigate(link);        
    }

     membercaptionn(comment: any): void {        
        var hashtagname = comment[1].split('#');
    //   console.log(hashtagname[1]);        
        let link = ['caption', hashtagname[1].replace(" ","")];
        this._router.navigate(link); 
              
    }

    memberprofilecaption(comment: any): void {        
        // var hashtagname = comment[1].split('@');
    //   console.log(hashtagname[1]);        
        // let link = ['personcaption', hashtagname[1].replace(" ","")];
        // this._router.navigate(link); 

        var personname = comment[1].split('@');
        var username = localStorage.getItem('username');
        if (username == personname[1]) {
            this._router.navigate(['profile']);
        }
        else {
            let link = ['', personname[1].replace(" ","")];
            this._router.navigate(link);
        }
              
    }

    memberprofilecaptionn(caption: any): void {      
        var personname = caption.split('@');
        var username = localStorage.getItem('username');
        if (username == personname[1]) {
            this._router.navigate(['profile']);
        }
        else {
            let link = ['', personname[1].replace(" ","")];
            this._router.navigate(link);
        }
              
    }
    // websitelink(data:any){
    //     alert(data.websiteUrl);
    //     let link = [data.websiteUrl];
    //      this._router.navigate(link);

    // }

    commentdelete(comment: any, id: any, postsType: any, i: number, k:number): void { 
        //  console.log(comment[0]+" ss "+comment[1]+" id "+id+" postsType "+postsType+" i "+i);
         postsType = postsType.toString();         
         this.commnentdetails=({username: comment.commentedByUser, message: comment.commentBody, commentId: comment.commentId, id: id, postsType: postsType, i:i, k:k});        
     }

      commentmodaldelete(): void { 
        //  console.log(this.commnentdetails);

        var commentlist =this.commnentdetails;
        var commenttext = commentlist.message;
        // var hashtag_regexp = /<a href=.*?>(.*?)<\/a>/;                
        // var comment_text = commenttext.replace(hashtag_regexp, '$1');

        // var hashtag_regexp = /<a href=.*?>(.*?)<\/a>/;                
        // var comment_textt = comment_text.replace(hashtag_regexp, '$1');
        var hashtag_regexp = /<a[^>]*>([^<]+)<\/a>/g;
        var comment_text = commenttext.replace(hashtag_regexp, '$1');
       
        // console.log(this.posts[commentlist.i].comments[commentlist.k]);     
        this.posts[commentlist.i].commentData.splice([commentlist.k], 1);       
         this._profileService.userdeletecomment({username: commentlist.username, message: comment_text, commentId: commentlist.commentId, id: commentlist.id, postsType: commentlist.postsType })
            .subscribe();
     }

    likeStatus(liked: any): void {
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

    
    likedoubleClick(id: any, postsType: any, i: number) {
        // alert(id+'aa'+'bb'+postsType+'cc'+i);
        if (this.posts[i].likeStatus == 0) {
            this.posts[i].likeheartFlagg = true;
            var username = localStorage.getItem('username');
            this.posts[i].postLikedBy.unshift(username);
            this.posts[i].likeStatus = 1;
            this.posts[i].likes += 1;
            this._profileService.userlike(id, postsType)
                .subscribe();
            setTimeout(() => {
                this.posts[i].likeheartFlagg = false;
            }, 500);
        }
    }

    likeactive(id: any, postsType: any, i: number) {
        // alert(id);
        var username = localStorage.getItem('username');
        this.posts[i].postLikedBy.unshift(username);
        this.posts[i].likeStatus = 1;
        this.posts[i].likes += 1;
        this._profileService.userlike(id, postsType)
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
    likedeactive(id: any, postsType: any, i: number) { 
        var username = localStorage.getItem('username');
        var array = this.posts[i].postLikedBy;
        var index = array.indexOf(username);        
           if (index > -1) {
                array.splice(index, 1);
            }           
        this.posts[i].likeStatus = 0;
        this.posts[i].likes -= 1;
        this._profileService.userunlike(id, postsType)
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

following(item:any, i:number){
    // alert(i+'ll'+username+'ff'+followFlag);
    var username = item.username;
    var memberPrivateFlag = item.memberPrivateFlag;
    this.data2[i].loaderFlag = true;
    if(memberPrivateFlag == 1) {
        setTimeout(() => { 
            this.data2[i].userFollowRequestStatus = 0;
        }, 500);
        this._profileService.following(username)
            .subscribe();
        setTimeout(() => {
            this.data2[i].loaderFlag = false;
        }, 500);
    }
    if(memberPrivateFlag != 1) {
        setTimeout(() => { 
            this.data2[i].userFollowRequestStatus = 1;
        }, 500);
        this._profileService.following(username)
            .subscribe();
        setTimeout(() => {
            this.data2[i].loaderFlag = false;
        }, 500);
    }
}

follow(item:any, i:number){ 
    var username = item.username;  
    this.data2[i].loaderFlag = true;
    setTimeout(() => { 
        this.data2[i].userFollowRequestStatus = null;
    }, 500);
    this._profileService.follow(username)
        .subscribe();
    setTimeout(() => {
        this.data2[i].loaderFlag = false;
    }, 500);
}

followingflag(item:any, i:number){
    var username = item.username;
    var memberPrivateFlag = item.memberPrivateFlag;
    // alert(i+'ll'+username+'ff'+followFlag);
    this.data1[i].loaderFlag = true;
    if(memberPrivateFlag == 1){
        setTimeout(() => { 
            this.data1[i].userFollowRequestStatus = 0;
        }, 500);
        this._profileService.following(username)
            .subscribe();
        setTimeout(() => {
            this.data1[i].loaderFlag = false;
        }, 500);
    }
    if(memberPrivateFlag != 1){
        setTimeout(() => { 
            this.data1[i].userFollowRequestStatus = 1;
        }, 500);
        this._profileService.following(username)
            .subscribe();
        setTimeout(() => {
            this.data1[i].loaderFlag = false;
        }, 500);
    }
}

followflag(item:any, i:number){  
    var username = item.username; 
    this.data1[i].loaderFlag = true;
        setTimeout(() => { 
            this.data1[i].userFollowRequestStatus = null;
        }, 500);
        this._profileService.follow(username)
            .subscribe();
        setTimeout(() => {
            this.data1[i].loaderFlag = false;
        }, 500);
}

usercommentSubmit(value: any, id: any, postsType: any, i: number) {
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
         if(value.length > 0){     
            // this.posts[i].comments.push([username, comment_textt]);

            this._profileService.usercomment({ message: value, id: id, postsType: postsType })
                .subscribe((res) => {
                this.submitComment = res.data; 
                this.posts[i].commentData.push(this.submitComment[0].commentData[0]);
                this.hashtagFunction(); 
            });
         }
    }

    left() {
        var strid = jQuery('.item.active').prev().attr("id")
          if(!strid){
          var strid =  jQuery('.item:last').attr("id")
        }
        if(strid){
            var id = strid.substr(0, strid.length -1)
            this.activeitemId = id;
        console.log(id)
        if (history.pushState) {
            var str = window.location.pathname;
            var backurl = window.location.protocol + "//" + window.location.host + '/' + str.split('/')[1];
            var newurl = window.location.protocol + "//" + window.location.host + '/' + str.split('/')[1] + '/' + id;      
           // window.history.pushState({path:backurl},'',backurl);
           this.lcount=0;
           window.history.replaceState(null,null,newurl);
        } 
    }
        
    }


    right() {
        var strid = jQuery('.item.active').next().attr("id")
        if(!strid){
          var strid = jQuery('.item:first').attr("id")
        }
        if(strid){
            var id = strid.substr(0, strid.length -1)
            this.activeitemId = id;
        if (history.pushState) {
            var str = window.location.pathname;
            var backurl = window.location.protocol + "//" + window.location.host + '/' + str.split('/')[1];
            var newurl = window.location.protocol + "//" + window.location.host + '/' + str.split('/')[1] + '/' + id;      
           // window.history.pushState({path:backurl},'',backurl);
           this.lcount=0;
            window.history.replaceState(null, null ,newurl);
        } 
    }
        
       
}

visitShop(name: string) {
        let link = [this.username +'/shop'];
        this._router.navigate(link);
    }
    viewList() {
        let link = [this.username +'/lists'];
        this._router.navigate(link);
    }
    updatePost(){
        localStorage.setItem('fromUrl', window.location.pathname)
         this._router.navigate(this.updateUrl); 
    }
        deleteId:any;
    dltIndex:any;
    dltMsg:string="Are you sure you want to delete post?";
     dltType:any='warning';
     buffer_dlt:boolean=false;
    deletePost(){
     this.buffer_dlt=true;
        this._profileService.deletePost(this.deleteId)
                .subscribe((res) => {
                  console.log(res);
                  var newurl = window.location.protocol + "//" + window.location.host +'/profile';
                    window.history.pushState(null,null,newurl);
                 this.dltMsg="Post deleted successfully.";
                 this.dltType='success';
                 this.buffer_dlt=false;
                   jQuery(".modal").fadeOut(1500);
                   jQuery(".modal-backdrop").css({ "display": "none" }).fadeOut(1500);
                   setTimeout(() => {
                    this.posts.splice(this.dltIndex, 1);
                     this.dltMsg="Are you sure you want to delete post?";
                   this.dltType='warning';
                  }, 2500);
                });
    }
      postCaption:any='Share your posts at merriment.io'
     imageUrl:any="http://merriment.io/public/images/pico_logo_new.png";
     shareFun(i:any,type:any) {
            this.aind = i;
     
        if(type==0){
         this.imageUrl=this.posts[i].mainUrl;
         this.postCaption=this.posts[i].description;
          this.updateUrl=  ['', 'updatepost/'+this.posts[i].postId];
            this.dltIndex=i;
            this.deleteId=this.posts[i].postId;
        }
        else{
               if(this.data.profilePicUrl.match(/\.(jpeg|jpg|gif|png)$/) != null){
                 this.imageUrl=this.data.profilePicUrl;
            }
            else{
             this.imageUrl="http://merriment.io"+jQuery("#pro_img").attr("src");
            }
            if(this.data.bio){
               this.postCaption=this.data.bio; 
            }
            else{
                this.postCaption='';
            }
        }
            var url = window.location.protocol+"//"+ window.location.host + window.location.pathname+'?ref='+ this.username;
            url=url.replace("profile", this.username);
            this._profileService.shortUrl(url)
            .subscribe((res) => {
                this.repoUrl = res.shorturl;
                console.log(res);
            });
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

    addnewlist(){
        console.log(this.newListname);
        this._listService.createList(this.username, this.newListname)
        .subscribe((res) => {
            if(res.code == 200) {
                this.getListInfo(this.activeitemId);
            }
        })
    }

    getActiveID(id: any){
        this.getListInfo(id);
        console.log(id);
    }

    addToList(listID:any, sel:any, ui:any) {
        var postID = this.activeitemId;
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
  percentComplete:any = 0;
  isUpload:boolean=false;
  isRemoved:boolean=false;
  progress:boolean=true;
  spiner:boolean=false;
  spiner1:boolean=false;
  uploadMsg:string;
  uploadMsg1:string;
updateProfilePic(e:any){
    this.isUpload=true;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'luwfpdzx');
    jQuery.ajax({
      url: 'https://api.cloudinary.com/v1_1/merriment/image/upload',
      data: data,
      processData: false,
      contentType: false,
      type: 'POST',
      xhr: () => {
          if ((<any>window).XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
          } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          }
          //var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress",  (evt:any)=> {
          if (evt.lengthComputable) {
            this.percentComplete = (evt.loaded / evt.total)*100;
            this.percentComplete = parseInt(this.percentComplete);
          }
        }, false);
          return xhr;
        },
        success: (res:any) => {
          console.log(res);
          this.progress=false;
          this.spiner=true;
          var splitBefore=res.secure_url.split('/upload/')[1];
          var splitAfter=splitBefore.split('/')[1];
          this.data.profilePicUrl= "https://res.cloudinary.com/merriment/image/upload/w_300/"+splitAfter;
            
       this._profileService.saveprofile(this.data)
                .subscribe((res) => {
                this.spiner=false;
                if(res.code==200){
                    this.uploadMsg="Profile Changed Successfully.";
                }
                else{
                     this.uploadMsg=res.message;
                }
                     setTimeout(() => {
                         this.uploadMsg='';
                     this.isUpload=false;
                      jQuery('.modal').modal('hide');
             }, 1500);  
            });
        }
        });
}

removeProfilePic(){
    this.isRemoved=true;
          this.spiner1=true;
          this.data.profilePicUrl='';
          this._profileService.saveprofile(this.data)
                .subscribe((res) => {
                this.spiner1=false;
                if(res.code==200){
                    this.data.profilePicUrl='public/images/user.jpg';
                    this.uploadMsg1="Profile Removed Successfully.";
                }
                else{
                     this.uploadMsg1=res.message;
                }
                     setTimeout(() => {
                           this.uploadMsg1='';
                     this.isRemoved=false;
                      jQuery('.modal').modal('hide');
             }, 1500);  
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