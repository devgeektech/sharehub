import { Component } from '@angular/core';
import { HomeService } from '../content/home.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router } from '@angular/router';
import { InfiniteScroll } from 'angular2-infinite-scroll';
import { HeaderComponent } from '../../header/header.component';
import { CeiboShare } from 'ng2-social-share';
import {listService} from './../list/list.service';
import {TruncatePipe} from '../../pipes/truncate.pipe';
import { UrlToImageService } from '../../sharedServices/urlToimage.service';
import { reportService } from '../../reportServices/report.service';
import {Clipboard} from 'ts-clipboard';
declare const jQuery: any;
declare const FB: any;
declare const twttr: any;
declare const window: any;
@Component({
    selector: 'content',
    templateUrl: './content.component.html',
    pipes: [TruncatePipe],
    directives: [ROUTER_DIRECTIVES, InfiniteScroll, HeaderComponent,CeiboShare],
    providers: [HomeService, listService, UrlToImageService,reportService]  
})

export class ContentComponent {
     showTagLabel=false;
    private data: any = [];
    // private data1: any = [];
    private token: any;

    private message: string;
    commnentdetails: any = [];
    // array:any = [];
    sum = 0;
    // items: any[] = [];
    // canFly = true;
    constructor(private _homeService: HomeService, private _router: Router, private _listService:listService,
    private _uTiService: UrlToImageService,private _reportService:reportService) {
        // for (let i = 0; i < this.sum; ++i) {
        //      this.array.push(i);
        // }

        FB.init({
            appId: '152854238613410',
            status:true,
            cookie: true,  // enable cookies to allow the server to access 
            version: 'v2.10' // use graph api version 2.5 
        });

    }
    private loading = true;
    private comment = false;
    private commentt = false;
    private firstallcomment = true;
    private lastcomment = false;
    private viewallcomment = false;
    private offset = 0;
    private loadmoree: any;
    private CurrentDate: any;
    private totaldata: any;
    private totaldata1: any;
    private commentdata: any;
    private lencomment1: any;
    private post = false;
    private nopost = false;
    private username: any;
    private twtrText = '';
    repoUrl:string="";
    submitComment: any;
    loadingmoreeLoder=true;
    namelen: any;
    sponLen:boolean=true;
    newListname = '';
    private userLists:any = [];
    private activeitem:any;
    cbyName:string;
    id:string;
    isCopied:boolean=false;
    private aind = 0;
    isOwner:boolean=true;
    updateUrl:any
    ppic:any;
    defaultImg:any="/public/images/user.jpg";
    imageUrl:any="https://merriment.io/public/images/pico_logo_new.png";
      rep_inapp:string="Report inappropriate";
        rep_spam:string="Report spam";
    ngOnInit() {
        jQuery(".modal-backdrop").css({ "display": "none" });
        this.ppic = localStorage.getItem('profilePicUrl');
        this.CurrentDate = new Date();
        var token = localStorage.getItem('authToken');
        if (!token)
            this._router.navigate(["login"]);

        var username = localStorage.getItem('username');
        this.username = username;
        if (username) {
            console.log(username)
        }
        this._homeService.home()
            .subscribe((res) => {
                if (res.code == 200) {
                    if (res.message != "success") {
                        // this.post = true;
                        this._router.navigate(["discoverpost"]);
                        // this.nopost = true;
                    }                   
                }
                this.loading = false;
                // this.data = res.result;
                this.data = [];
                console.log("response data");
                console.log(res);
                console.log("above data");
                this.totaldata = res.data;
                //  this.totaldata1 = res.result;
                this.offset = this.totaldata.length;

                this.commentfunction();
                if (this.offset >= 10)
                    this.loadmoree = true;
            });
        jQuery(document).keyup(function (e: any) {

            if (e.keyCode == 27) {
                jQuery(".modal").css({ "display": "none" });
                jQuery(".modal-backdrop").css({ "display": "none" });
            }
        });

        // this._listService.getUserList(username)
        // .subscribe((res) => {
        //     this.userLists = res;
        // })

        jQuery(document).on('hidden.bs.modal','#myModal_list', (e: any, chip:any) => {
              jQuery("#hideShowLable").css({'width':'100%'});
        })

        // jQuery('body').on('click', '#facebook1', ()=> {
        
        // });

        twttr.events.bind('tweet', (event:any)=> {
       window.location = "http://www.mysite.com"

    });

    }
    fbShare() {
        console.log(this.aind);
        var ind = this.aind;
            var cap = '';
            for(var i=0; i<this.data[ind].postCaption.length; i++) {
                if(i == 0){
                    cap = this.data[ind].postCaption[i]
                } else {
                    cap = cap + " "+ this.data[ind].postCaption[i];
                }
            }
            FB.ui({
                method: 'share_open_graph', 
                action_type: 'og.shares',
                action_properties: JSON.stringify({
                    object : {
                        'og:url': this.repoUrl,
                        'og:title': this.data[ind].postedByUserName  + ' (' +  this.data[ind].postedByUserFullName + ')' + 'on Merriment.io',
                        'og:description':cap,
                        'og:image:url': this.data[ind].mainUrl,
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
        this.hashtagFunction();
        var len = this.totaldata.length;
        for (var i = 0; i < len; i++) {
          
            var postCaption: any = [];
             this.totaldata[i].description= this.totaldata[i].postCaption;
            if (this.totaldata[i].postCaption) {
                var postCaptionn = this.totaldata[i].postCaption.split(' ');
                this.totaldata[i].postCaption = postCaptionn;
            }

            var likedByUser: any = [];
            if (this.totaldata[i].likedByUser) {
                var liked = this.totaldata[i].likedByUser.split(',');
                if (liked.length) {
                    this.totaldata[i].likedByUser = liked;
                }
            } else {
                this.totaldata[i].likedByUser = [];
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
            var sponProductTags: any = [];
            if (this.totaldata[i].sponProductTags) {
                sponProductTags = this.totaldata[i].sponProductTags.split(',');
                this.totaldata[i].sponProductTags = sponProductTags;
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

            console.log(tagsCords)
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

            this.data.push(this.totaldata[i]);
            
        }
        console.log(this.data);

    }
    commentslength: any;
    allcomment(i: any) {
        this.data[i].commentFlag = true;
        this.data[i].commentFlagg = true;

    }
    usertagged(i: any) {
        
        console.log(this.data[i])
        if(this.data[i].usertaggedFlagg==false || !this.data[i].usertaggedFlagg){
            this.id=this.data[i].postId;
            this.cbyName=this.data[i].postedByUserName;
            this.showTagLabel=true;
        var getID = i;
        var contWidth = jQuery("#" + getID).width();
        var contHeight = jQuery("#" + getID).height();
        var getWidth=contHeight*this.data[i].containerRatio;
         var getHeight=contWidth/this.data[i].containerRatio;
        var tagsCords: any = [];
        if (this.data[i].usersTaggedInPosts[0] != 'undefined' && this.data[i].taggedUserCoordinates[0] != null && this.data[i].usersTaggedInPosts.length > 0 && this.data[i].taggedUserCoordinates.length > 0) {
            var lenn = this.data[i].usersTaggedInPosts.length;
            for (var j = 0; j < lenn; j++) {
                var userCords = {
                    name: this.data[i].usersTaggedInPosts[j],
                    right: 0,
                    top: 0,
                    isRight: false,
                };
                if (this.data[i].taggedUserCoordinates[j]) {
                    if (this.data[i].taggedUserCoordinates[j][0] && this.data[i].taggedUserCoordinates[j][1]) {
                        //  this.namelen = ((this.data[i].usersTaggedInPosts[j].length-1)*2);
                        var str1 = this.data[i].taggedUserCoordinates[j][0];
                        var right = str1 * getWidth;
                        var str2 = this.data[i].taggedUserCoordinates[j][1];
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
        if (this.data[i].sponProducts.length > 0) {
            var lenn = this.data[i].sponProducts.length;
            if(lenn>0){
                 jQuery("#pp_"+this.data[i].postId).slideToggle("fast");
                 this.sponLen=false;
            }
            for (var k = 0; k < lenn; k++) {
                var productCords = {
                    imageUrl: this.data[i].sponProducts[k].mainUrl,
                    name: this.data[i].sponProducts[k].productName + ' by ' + this.data[i].sponProducts[k].owner.businessName,
                    right: 0,
                    top: getHeight,
                    isRight: false,
                    uname: this.data[i].sponProducts[k].owner.username,
                    pId:this.data[i].sponProducts[k].postId,
                     price:this.data[i].sponProducts[k].price !='undefined' ? this.data[i].sponProducts[k].price : 0,

                };
                if (this.data[i].sponProductCoordinates[k]) {
                    if (this.data[i].sponProductCoordinates[k][0] && this.data[i].sponProductCoordinates[k][1]) {
                        var str1 = this.data[i].sponProductCoordinates[k][0];
                        var right = str1 * getWidth;  
                        var str2 = this.data[i].sponProductCoordinates[k][1];
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
                      this.data[i].isThumb=true;
                    tagsCords.push(productCords);
                }
            }
        }
        this.data[i].coords = tagsCords;
        this.data[i].usertaggedFlagg = true;
    }
    else{
         this.showTagLabel=false;
        this.data[i].usertaggedFlagg = false;
             if(this.sponLen==false){
               this.sponLen=true;
             jQuery("#pp_"+this.data[i].postId).slideToggle("fast");
             }
    }
        //  this.calWidth(i)

    }

    loadmore() {
        this.loadingmoreeLoder=false;
        console.log(this.offset);
        if(this.offset >= 10){
        this._homeService.loadmore(this.offset)
            .subscribe((res) => {
                console.log("laod");
                console.log(res);
                this.totaldata = res.data;
                this.commentfunction();
                this.offset = res.data.length || 0;
                 this.loadingmoreeLoder=true;
                if (this.offset >= 10)
                    this.loadmoree = true;
                else
                    this.loadmoree = false;
            });
        }
    }

    timepost(item: any) {
        var postId = item.postId;
        var postedByUserName = item.postedByUserName;
        // console.log(postId+"ff"+postedByUserName);
        let link = ['', postedByUserName, postId];
        this._router.navigate(link);
    }

    memberprofile(item: any): void {
        console.log(item);
        var personname = item.postedByUserName;
        var username = localStorage.getItem('username');
        if (username == personname) {
            this._router.navigate(['profile']);
        }
        else {
            let link = ['', personname];
            this._router.navigate(link);
        }
    }
    memberprofileplace(item: any): void {
        var placename = item.place;
        // console.log(placename);
        let link = ['location', placename];
        this._router.navigate(link);
    }

    memberprofilee(comment: any): void {
        var personname = comment.commentedByUser;
        var username = localStorage.getItem('username');
        if (username == personname) {
            this._router.navigate(['profile']);
        }
        else {
            let link = ['', comment.commentedByUser];
            this._router.navigate(link);
        }
    }

    membercaption(caption: any): void {
        var hashtagname = caption.split('#');
        console.log(hashtagname);
        let link = ['caption', hashtagname[1]];
        this._router.navigate(link);
    }

    membercaptionn(comment: any): void {
        var hashtagname = comment[1].split('#');
        //   console.log(hashtagname[1]);        
        let link = ['caption', hashtagname[1].replace(" ", "")];
        this._router.navigate(link);

    }

    memberprofilecaption(comment: any): void {

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

    memberprofilecaptionn(caption: any): void {
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

    // var commnentdetails:any=[];
    commentdelete(comment: any, id: any, postsType: any, i: number, k: number): void {
        //  console.log(comment[0]+" ss "+comment[1]+" id "+id+" postsType "+postsType+" i "+i);
        postsType = postsType.toString();
        this.commnentdetails = ({ username: comment.commentedByUser, message: comment.commentBody, commentId: comment.commentId, id: id, postsType: postsType, i: i, k: k });
    }

    commentmodaldelete(): void {
        console.log(this.commnentdetails);
        var commentlist = this.commnentdetails;
        var commenttext = commentlist.message;
        var hashtag_regexp = /<a[^>]*>([^<]+)<\/a>/g;
        var comment_text = commenttext.replace(hashtag_regexp, '$1');
        //  console.log(commentlist.i);
        this.data[commentlist.i].commentData.splice([commentlist.k], 1);

        this._homeService.userdeletecomment({ username: commentlist.username, message: comment_text, commentId: commentlist.commentId, id: commentlist.id, postsType: commentlist.postsType })
            .subscribe();
    }

    likedbyuser(liked: any): void {
        var personname = liked;
        var username = localStorage.getItem('username');
        if (username == personname) {
            this._router.navigate(['profile']);
        }
        else {
            let link = ['', personname];
            this._router.navigate(link);
        }
    }

    usertaggedname(tagged: any): void {
          jQuery('.modal').modal('hide');
          jQuery(".modal-backdrop").css({ "display": "none" });
    
        if(tagged.pId){
          let link = ['', tagged.uname,'shop',tagged.pId];
                 localStorage.setItem("cretedBy", this.cbyName);
                 this._router.navigate(link, { queryParams: { postId: this.id}});
        }
        else{
        var personname = tagged.name;
        var username = localStorage.getItem('username');
                let link = ['', personname];
                 localStorage.setItem("cretedBy", this.cbyName);
                 this._router.navigate(link, { queryParams: { postId: this.id}});
        }





        // if(tagged.pId){
        //   let link = ['', tagged.uname,'shop',tagged.pId];
        //     this._router.navigate(link);
        // }
        // else{
        // var personname = tagged.name;
        // var username = localStorage.getItem('username');
        // if (username == personname) {
        //     this._router.navigate(['profile']);
        // }
        // else {
        //     let link = ['', personname];
        //     this._router.navigate(link);
        // }
        // }
     
    }

    likedoubleClick(id: any, postsType: any, i: number) {
        if (this.data[i].likeStatus == 0) {
            this.data[i].likeheartFlagg = true;
            var username = localStorage.getItem('username');
            this.data[i].likedByUser.unshift(username);
            this.data[i].likeStatus = 1;
            this.data[i].likes += 1;
            this._homeService.userlike(id, postsType)
                .subscribe();
            setTimeout(() => {
                this.data[i].likeheartFlagg = false;
            }, 500);
        }
    }

    likeactive(id: any, postsType: any, i: number) {
        var username = localStorage.getItem('username');
        this.data[i].likedByUser.unshift(username);
        this.data[i].likeStatus = 1;
        this.data[i].likes += 1;
        this._homeService.userlike(id, postsType)
            .subscribe();
              var likes=Number(this.data[i].likes);
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
              this.data[i].getCount=getCount;
    }
    likedeactive(id: any, postsType: any, i: number) {
        var username = localStorage.getItem('username');
        var array = this.data[i].likedByUser;
        var index = array.indexOf(username);
        if (index > -1) {
            array.splice(index, 1);
        }
        this.data[i].likeStatus = 0;
        this.data[i].likes -= 1;
        this._homeService.userunlike(id, postsType)
            .subscribe();
                  var likes=Number(this.data[i].likes);
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
              this.data[i].getCount=getCount;

    }

    usercommentSubmit(value: any, id: any, postsType: any, i: number) {
        postsType = postsType.toString();
        // console.log('you submitted value:', value, id, postType, i);        
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
        // console.log(value.length)
        if (value.length > 0) {
  
            this._homeService.usercomment({ message: value, id: id, postsType: postsType })
                .subscribe((res) => {
                    this.submitComment = res.data;
                    this.data[i].commentData.push(this.submitComment[0].commentData[0]);
                    this.hashtagFunction();
                });
        }
    }
    
    updatePost(){
        localStorage.setItem('fromUrl','')
         this._router.navigate(this.updateUrl); 
    }
    deleteId:any;
    dltIndex:any;
    dltMsg:string="Are you sure you want to delete post?";
     dltType:any='warning';
     buffer_dlt:boolean=false;
    deletePost(){
     this.buffer_dlt=true;
        this._homeService.deletePost(this.deleteId)
                .subscribe((res) => {
                  console.log(res);
               
                 this.dltMsg="Post deleted successfully.";
                 this.dltType='success';
                 this.buffer_dlt=false;
                jQuery(".modal").fadeOut(1800);
                 jQuery(".modal-backdrop").css({ "display": "none" }).fadeOut(1800);
                   setTimeout(() => {
                   this.data.splice(this.dltIndex, 1);
                    this.dltMsg="Are you sure you want to delete post?";
                   this.dltType='warning';
              }, 2500);
                
                 
                });
    }
      postCaption:any;
      pShareUrl:any;
      pImageUrl:any
      shareFun(i:any) {
          this.repoUrl='';
              this.pShareUrl='';
              this.postCaption='';
         this.postCaption=this.data[i].description;
         this.aind = i;
        this.pImageUrl=this.data[i].mainUrl;
         if(this.data[i].postedByUserName==this.username){
          this.isOwner=false;
            this.dltIndex=i;
          this.deleteId=this.data[i].postId;
          this.updateUrl=  ['', 'updatepost/'+this.data[i].postId];
         }
         else{
              this.isOwner=true;
         }
        var getPath="/"+this.data[i].postedByUserName +"/"+this.data[i].postId+'?ref='+ this.username;
        var url = window.location.protocol + "//" + window.location.host + getPath;
         this.pShareUrl=url;
        this._homeService.shortUrl(url)
            .subscribe((res) => {
                this.repoUrl = res.shorturl;
                console.log(res);
            });
            var str = '';
        for(var j=0; j<this.data[i].postCaption; j++){
            if(j==0){
                str = this.data[i].postCaption[j];
            }else {
                str = str + this.data[i].postCaption;
            }
        }
         console.log(   this.postCaption);
            console.log(   this.pImageUrl);
               console.log(   this.pShareUrl);
        this.setMeta(this.data[i].postedByUserName, str, this.data[i].mainUrl);
        
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
        this.activeitem = id;
        this.getListInfo(id);
        console.log(id);
    }
    addnewlist(){
        console.log(this.newListname);
        this._listService.createList(this.username, this.newListname)
        .subscribe((res) => {
            if(res.code == 200) {
                this.getListInfo(this.activeitem)
            };
        });
    };


    addToList(listID:any, sel:any, ui:any) {
        var postID = this.activeitem;
        var len = this.data.length;
        var index = 0;
        for(var i=0; i<len; i++) {
            if(this.data[i].postId == postID){
                index = i;
            }
        }
        if(sel == 0) {
            this._listService.addPostToList(listID,postID)
            .subscribe((res) => {
                console.log(res);
                if(res.code == 200) {
                    this.userLists[ui].selected = 1;
                    this.data[index].listsCount += 1;
                    var list=Number(this.data[index].listsCount);
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
                    this.data[index].getListCount=getListCount;
                    this.listStatus(index);
                }
            })
        }  else {
            this._listService.removePostFromList(listID,postID)
            .subscribe((res) => {
                console.log(res);
                if(res.code == 200) {
                    this.userLists[ui].selected = 0;
                    this.data[index].listsCount -= 1;
                      var list=Number(this.data[index].listsCount);
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
                    this.data[index].getListCount=getListCount;
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
        console.log(index);
        var len = this.userLists.length;
        var count=0;
        for(var i=0;i<len;i++) {
            if(this.userLists[i].selected == 1) {
                count++;
            }
        }
       if(count >= 1) {
            this.data[index].listStatus = true;
        } else {
            this.data[index].listStatus = false;
        }
    }

    setMeta(t:any,d:any,i:any){
        jQuery("meta[name='twitter:title']").attr("content", t);
        jQuery("meta[name='twitter:description']").attr("content", d);
        jQuery("meta[name='twitter:image']").attr("content", i);
    }

    twitterShare() {
        jQuery('#twtrShare').modal('show');
        jQuery('#myModall').modal('hide');
        this.twtrText = this._uTiService.setTwitterText(this.data[this.aind], this.repoUrl);
    }
    tweet() {
        var file = this.data[this.aind].mainUrl
        this._uTiService.previewFile(file, this.twtrText);
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
          postId:this.data[this.aind].postId,
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
}
export class TwitterParams {
    text: string;
    url: string;
    hashtags: string;
    via: string;
    media: string;
}