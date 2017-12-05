import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router, ActivatedRoute  } from '@angular/router';
import {listService} from '../list/list.service';
import { Observable } from 'rxjs/Observable';
import {HeaderComponent} from '../../header/header.component';
declare const jQuery: any;
declare const FB:any;
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { CeiboShare } from 'ng2-social-share';
import {TruncatePipe} from '../../pipes/truncate.pipe';
import { reportService } from '../../reportServices/report.service';
import {Clipboard} from 'ts-clipboard';
import { UrlToImageService } from '../../sharedServices/urlToimage.service';
@Component({
    selector: 'list',
    templateUrl: '/list.component.html',
    directives: [ROUTER_DIRECTIVES, HeaderComponent, CeiboShare],
     pipes: [TruncatePipe],
    providers: [listService,reportService,UrlToImageService]
})

export class ListComponent {

    private name: string;
    private data: any;
    private posts: any = [];
    private shopsPosts: any = [];
    private listArr: any = [];
    private fItems: any = [];
    private loading = true;
    private buffer = false;
    private flag: boolean = false;
    private lcount: number = 0;
    private listsCount: number = 0;
    private likeCount: number = 0;
    private Alldata: any = [];
    private tempArr: any = [];
    private role: string = 'self';
    private cntWd:number;
    private sldWd:number;
    private tb: any;
    private aI: number = 0;
    private loadingF: boolean = false;
    private arrowLeft: boolean = false;
    private arrowRight: boolean = true;
    private searhList: any = [];
    private token:any;
    username: any;
    commnentdetails: any = [];
    submitComment:any;
    blur_close: boolean = false;
     actives: any = {
        f: false,
        i: false,
        t: false
    }
    activelistIndex = 0;
    comment: string = '';
    textareaLength: number = 120;
    repoUrl: string = '';
    newListname = '';
    private userLists:any = [];
    aPostId:any;
    listFollowerData:any;
    listname:string;
    private aind = 0;
    constructor(private _listService: listService, private _router: Router, private route: ActivatedRoute, private _reportService:reportService, 
    private _uTiService:UrlToImageService) {
        FB.init({
            appId: '152854238613410',
            status:true,
            cookie: true,  // enable cookies to allow the server to access 
            version: 'v2.10' // use graph api version 2.5 
        });   
    }
    private twtrText = '';
    private offset = 0;
    private loadmoree: any;
    private data1: any;
    private data2: any;
    private data3: any;
    private privatemember: any;
    private catname: any;
    totaldata: any;
    commentdata: any;
    namelen:any;
    persondata = false;
    personnodata =false;
    sponLen:boolean=true;
    showTagLabel:boolean=false;
    ifMobile:boolean;
    isExist:boolean=false;
    id:any;
    onTagClick:boolean=false;
    isCopied:boolean = false;
    isOwner:boolean=true;
    updateUrl:any;
    rep_inapp:string="Report inappropriate";
    rep_spam:string="Report spam";
    ngOnInit() {
        this.ifMobile = this.detectmob();
        jQuery(".modal-backdrop").css({ "display": "none" });
        var username = localStorage.getItem('username');
        this.username = username;
        this.token = localStorage.getItem('authToken');
        this.route.params.subscribe(params => {
            this.name = params['name'];
            this.catname = params['categoryName'];
            this.listname = decodeURIComponent(params['listname']);
            console.log('catname', this.catname);
            console.log(this.name);
            this.loading = true;
            // this._listService.personprofile(this.name)
            //     .subscribe((res) => {
            //         if(res.code == 1800){
            //           this.persondata = false;
            //           this.personnodata =true;
            //         }
            //          if(res.code == 200){
            //             this.persondata = true;
            //             this.personnodata =false;
            //             this.loading = false;
            //             this.data = res.memberProfileData[0]; 
            //             console.log("profiledata")
            //             console.log(this.data);                       
                        
            //             this.privatemember = this.data.privateMember

            //             this.posts=[];
            //             // this.totaldata = res.memberPostsData;
            //             this.offset = res.memberPostsData.length;

            //           //  this.commentfunction();

            //             if (this.offset >= 20)
            //                 this.loadmoree = true;
            //          }
            //     });
            // this._listService.memberFollowing(this.name)
            //     .subscribe((res) => {
            //         this.data1 = res.following;
            //         this.loading = false;
            //     });

            // this._listService.memberFollowers(this.name)
            //     .subscribe((res) => {
            //         this.data2 = res.memberFollowers;
            //         this.loading = false;
            //     });

            this._listService.getUserList(this.name).subscribe((res) => {
                var len = res.data.result.length;
                this.persondata = true;
                this.personnodata =false;
                this.loading = false;
                this.data = res.data.memberProfileData;        
                this.privatemember = this.data.privateMember

                this.Alldata = res.data.result;
                this.shopsPosts = [];
                this.listArr = [];
                this.activelistIndex = 0
                var username = localStorage.getItem('username');
                var ownArr:any = [];
                var otherArr:any = [];
                if(this.username != this.name) {
                    for(var i=0; i<len; i++) {
                        if(res.data.result[i].list.properties.ownerName == this.name) {
                           var nm = res.data.result[i].list.properties.name
                            if(nm == "wishList") {
                                nm = " Wish List"
                            }
                            ownArr.push({
                                'name':nm,
                                'id':res.data.result[i].list.properties.id,
                                'properties': res.data.result[i].list.properties,
                                'followerCount':res.data.result[i].followerCount,
                                'isFollowList':res.data.result[i].isFollowList,
                                'isFollowUser':res.data.result[i].isFollowUser,
                                'isOwnerPrivate':res.data.result[i].isOwnerPrivate
                            }); 
                        }
                    }
                    this.listArr = ownArr;
                } else {
                    for(var i=0; i<len; i++) {
                    if(res.data.result[i].list.properties.ownerName != username) {
                        var nm = res.data.result[i].list.properties.name
                        if(nm == "wishList") {
                            nm = " Wish List by "+res.data.result[i].list.properties.ownerName
                        } else {
                            nm = nm +" by "+res.data.result[i].list.properties.ownerName
                        }
                        otherArr.push({
                            'name':nm,
                            'id':res.data.result[i].list.properties.id,
                            'properties': res.data.result[i].list.properties,
                            'followerCount':res.data.result[i].followerCount,
                            'isFollowList':res.data.result[i].isFollowList,
                            'isFollowUser':res.data.result[i].isFollowUser,
                            'isOwnerPrivate':res.data.result[i].isOwnerPrivate
                        });
                    } else {
                        var nm = res.data.result[i].list.properties.name
                        if(nm == "wishList") {
                            nm = " Wish List"
                        }
                        ownArr.push({
                            'name':nm,
                            'id':res.data.result[i].list.properties.id,
                            'properties': res.data.result[i].list.properties,
                            'followerCount':res.data.result[i].followerCount,
                            'isFollowList':res.data.result[i].isFollowList,
                            'isFollowUser':res.data.result[i].isFollowUser,
                            'isOwnerPrivate':res.data.result[i].isOwnerPrivate
                        });
                    } 
                    }
                    this.listArr = ownArr.concat(otherArr);
                }
                this.getListDetails(this.listArr[0].id);
                console.log(this.listArr);
                
                this.fItems = this.searhList;
                if(this.listArr[0].properties.ownerName == this.username) {
                    this.role = 'self'
                }else {
                    this.role = 'other';
                }

                if(this.listname && this.listname != undefined && this.listname != 'undefined') {
                    var newurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/lists/'+this.listname;
                } else {
                    var newurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/lists/'+this.listArr[0].name;
                }
                
                window.history.replaceState(null,null,newurl);

            });   

            
        });
        
        jQuery(document).keyup(function (e: any) {
            if (e.keyCode == 27) {
                jQuery(".modal").css({ "display": "none" });
                jQuery(".modal-backdrop").css({ "display": "none" });
            }
        });

        jQuery(window).on('popstate', (e: any, chip:any) => { 
            jQuery("#myModalp").modal('hide');
        });
         
        jQuery(document).on('hidden.bs.modal','#myModalp', (e: any, chip:any) => {
               var newurl = window.location.protocol + "//" + window.location.host +'/'+ this.name +'/lists';
              window.history.pushState(null,null,newurl);
        })
        jQuery(document).ready( () => {
            jQuery(document).on('mousemove', '#container', (e:any) => {
                jQuery('#container').css({'display': 'block'});
                var cntWd = jQuery('#container').innerWidth();
                var ofcnt = jQuery('#container').offset().left;
                var tb = jQuery('#thumbs');
                var sldWd = tb.innerWidth();
                var calc = ((cntWd - sldWd)*((e.pageX-ofcnt)/ cntWd)).toFixed(1)
                if(!this.ifMobile) {
                    if (sldWd > cntWd) {
                        tb.css({left: calc +"px" });
                    }
                }
            });
        });

        document.addEventListener('scroll', (e:any) => {
        jQuery('#container').css({'display': 'block'});
            var cntWd = jQuery('#container').innerWidth();
            var ofcnt = jQuery('#container').offset().left;
		    var tb = jQuery('#thumbs');
		    var sldWd = tb.innerWidth();
            if(tb.offset().left == ofcnt){
                this.arrowLeft = false;
                this.arrowRight = true;
            }else if(Math.abs(cntWd)+Math.abs(ofcnt)+Math.abs(tb.offset().left) == sldWd) {
                this.arrowRight = false;
                this.arrowLeft = true;
            }else {
                this.arrowLeft = true;
                this.arrowRight = true;
            }
    }, true);

    jQuery(document).on('hidden.bs.modal','#myModal_list', (e: any, chip:any) => {
        jQuery("#hideShowLable").css({'width':'100%'});
    });

    setTimeout(() => {
        jQuery('#container').css({'display': 'block'});
        var cntWd = jQuery('#container').innerWidth();
        var ofcnt = jQuery('#container').offset().left;
	    var tb = jQuery('#thumbs');
	    var sldWd = tb.innerWidth();
        console.log(cntWd, sldWd);
        if(cntWd > sldWd) {
            this.arrowLeft = false;
            this.arrowRight = false;
        }
    }, 4000)

    //  jQuery('body').on('click', '#facebook4', ()=> {
         
    //     });
    

    }

    fbShare() {
        var ind = this.aind;
            var cap = '';
            for(var i=0; i<this.shopsPosts[ind].postCaption.length; i++) {
                if(i == 0){
                    cap = this.shopsPosts[ind].postCaption[i]
                } else {
                    cap = cap + " "+ this.shopsPosts[ind].postCaption[i];
                }
            }

            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.shares',
                action_properties: JSON.stringify({
                    object : {
                        'og:url': this.repoUrl,
                        'og:title': this.shopsPosts[ind].postedByUserName  + ' (' +  this.shopsPosts[ind].postedByUserFullName + ')' + 'on Merriment.io',
                        'og:description':cap,
                        'og:image:url': this.shopsPosts[ind].mainUrl,
                        'og:image:width': '1920',
                        'og:image:height': '1200',
                    }
                })
                }, (response:any)=>{

                });
    }

    hashtagFunction(){
        var len = this.totaldata.length;
         for (var i = 0; i < len; i++) {0
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
        var newData:any = [];
        var len = this.totaldata.length;     
        for (var i = 0; i < len; i++) {
         
              if (this.totaldata[i].categoryTags) {
                this.totaldata[i].categoryTags =this.totaldata[i].categoryTags.split(',');
            }
            else{
                 this.totaldata[i].categoryTags=[];
            }
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
            newData.push(this.totaldata[i]);
        }
        this.shopsPosts = newData;
        console.log("shopPosts data");
        console.log(this.shopsPosts);
    }


    loadmore() {
        // console.log(this.offset, this.name);
        this.offset = this.posts.length;
        this._listService.loadmore(this.offset, this.name)
            .subscribe((res) => {
                // var len = res.memberPostsData.length;
                // for (var i = 0; i < len; i++) {
                //     this.posts.push(res.memberPostsData[i]);
                // }

                this.totaldata = res.memberPostsData;
                this.commentfunction();

                this.offset = res.memberPostsData.length || 0;
                if (this.offset >= 20)
                    this.loadmoree = true;
                else
                    this.loadmoree = false;
            });
    }

    timepost(item: any) {
        var getAddress=window.location.pathname.split('/');
        if(getAddress.length==3){
          var postsId = getAddress[2];
         var followingUsername =  getAddress[1];        
         var link = ['', followingUsername, postsId];
       
        }
        if(getAddress.length==4){
          var postsId = getAddress[3];
         var followingUsername =  getAddress[1]+'/shop';        
         var link = ['', followingUsername, postsId];
       
        }
         this._router.navigate(link);
    }
   goToProfile(){
       if(this.name==this.username){
           var link = ['', 'profile']; 
       }
       else{
             var link = ['', this.name];
       }
       
        this._router.navigate(link);
   }
    usertagged(i: any) {
        console.log(this.shopsPosts[i]);
        if(this.shopsPosts[i].usertaggedFlagg==false || !this.shopsPosts[i].usertaggedFlagg){
         this.showTagLabel=true;
        var getID = i;
        var contWidth = jQuery("#" + getID).width();
        var contHeight = jQuery("#" + getID).height();
        var getWidth=contHeight*this.shopsPosts[i].containerRatio;
         var getHeight=contWidth/this.shopsPosts[i].containerRatio;
        var tagsCords: any = [];
        if (this.shopsPosts[i].usersTaggedInPosts[0] != 'undefined' && this.shopsPosts[i].taggedUserCoordinates[0] != null && this.shopsPosts[i].usersTaggedInPosts.length > 0 && this.shopsPosts[i].taggedUserCoordinates.length > 0) {
            var lenn = this.shopsPosts[i].usersTaggedInPosts.length;
            for (var j = 0; j < lenn; j++) {
                var userCords = {
                    name: this.shopsPosts[i].usersTaggedInPosts[j],
                    right: 0,
                    top: 0,
                    isRight: false,
                };
                if (this.shopsPosts[i].taggedUserCoordinates[j]) {
                    if (this.shopsPosts[i].taggedUserCoordinates[j][0] && this.shopsPosts[i].taggedUserCoordinates[j][1]) {
                        //  this.namelen = ((this.data[i].usersTaggedInPosts[j].length-1)*2);
                        var str1 = this.shopsPosts[i].taggedUserCoordinates[j][0];
                        var right = str1 * getWidth;
                        var str2 = this.shopsPosts[i].taggedUserCoordinates[j][1];
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
      
        if (this.shopsPosts[i].sponProducts && this.shopsPosts[i].sponProducts.length > 0) {
            var lenn = this.shopsPosts[i].sponProducts.length;
           if(lenn>0){
                jQuery("#pp_"+this.shopsPosts[i].postId).slideToggle("fast");
                  this.sponLen=false;
              }
            for (var k = 0; k < lenn; k++) {
                var productCords = {
                    imageUrl: this.shopsPosts[i].sponProducts[k].mainUrl,
                    name: this.shopsPosts[i].sponProducts[k].productName + ' by ' + this.shopsPosts[i].sponProducts[k].owner.businessName,
                    right: 0,
                    top: getHeight,
                    isRight: false,
                    uname: this.shopsPosts[i].sponProducts[k].owner.username,
                    pId:this.shopsPosts[i].sponProducts[k].postId,
                    price:this.shopsPosts[i].sponProducts[k].price
                };
                console.log(productCords);
                if (this.shopsPosts[i].sponProductCoordinates[k]) {
                    if (this.shopsPosts[i].sponProductCoordinates[k][0] && this.shopsPosts[i].sponProductCoordinates[k][1]) {
                        var str1 = this.shopsPosts[i].sponProductCoordinates[k][0];
                        var right = str1 * getWidth;  
                        var str2 = this.shopsPosts[i].sponProductCoordinates[k][1];
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
                      this.shopsPosts[i].isThumb=true;
                    tagsCords.push(productCords);
                }
            }
        }
        
        console.log(tagsCords);
        this.shopsPosts[i].coords = tagsCords;
        this.shopsPosts[i].usertaggedFlagg = true;
    }
    else{
         this.showTagLabel=false;
        this.shopsPosts[i].usertaggedFlagg = false;
          if(this.sponLen==false) {
               this.sponLen=true;
             jQuery("#pp_"+this.shopsPosts[i].postId).slideToggle("fast");
         }
    }
    }
    falseusertagged(i:any){
        this.posts[i].usertaggedFlagg = false; 
    }

    usertaggedname(tagged: any): void {
              jQuery(".modal-backdrop").css({ "display": "none" });
    
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

    activeitem(pid: any,type:any,data:any) {
        console.log(data);
        if(!this.onTagClick){
            this.id=pid;
         var urlchunks = window.location.pathname.split('/');
        var username = urlchunks[1];  
        if(data.productName == null){
            if(type==1){
            if (history.pushState) {
                 var backurl = window.location.protocol + "//" + window.location.host + '/' + data.postedByUserName +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + data.postedByUserName +'/' +this.id;
                window.history.pushState(null,null,newurl);
            }
                 jQuery('.item').removeClass("active");
                jQuery('#' + pid + 'w').addClass("active");
            }
            else{
                 let link = ['', username,pid];
                this._router.navigate(link);
            }
        }
        else{
         if(type==1){
            if (history.pushState) {
                 var backurl = window.location.protocol + "//" + window.location.host + '/' +  data.postedByUserName +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' +  data.postedByUserName +'/shop/'+this.id;
                window.history.pushState(null,null,newurl);
            }
                 jQuery('.item').removeClass("active");
                jQuery('#' + pid + 'w').addClass("active");
            }
            else{
                let link = ['', username,'shop',pid];
                    this._router.navigate(link);
            } 
        }
        }
    
    }
    activeitem2(pid: any) {
        localStorage.setItem('showProduct', JSON.stringify(this.shopsPosts));
        localStorage.setItem('productId', pid);
        let link = [this.name+'/', pid];
        this._router.navigate(link);
        jQuery('.item').removeClass("active");
        jQuery('#' + pid + 'w').addClass("active");
    }

    memberprofile(item: any): void {
        console.log("here");
        var personname = item.postedByUserName;
        var username = localStorage.getItem('username');
        if (username == personname) {
            this._router.navigate(['profile']);
        }
        else {
            let link = ['', personname];
            this._router.navigate(link);
        }
        // let link = ['/person', item.username];
        // this._router.navigate(link);
    }
    
    memberprofilee(comment: any): void {
        var personname = comment.commentedByUser;
        var username = localStorage.getItem('username');
        if (username == personname) {
            this._router.navigate(['profile']);
        }
        else {
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
        let link = ['caption', hashtagname[1].replace(" ", "")];
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

    commentdelete(comment: any, id: any, postsType: any, i: number, k: number): void {
        //  console.log(comment[0]+" ss "+comment[1]+" id "+id+" postsType "+postsType+" i "+i);
        postsType = postsType.toString();
        this.commnentdetails = ({ username: comment.commentedByUser, message: comment.commentBody, commentId: comment.commentId, id: id, postsType: postsType, i: i, k: k });
    }

    commentmodaldelete(): void {
        //  console.log(this.commnentdetails);            
        var commentlist = this.commnentdetails;
        var commenttext = commentlist.message;

        var hashtag_regexp = /<a[^>]*>([^<]+)<\/a>/g;
        var comment_text = commenttext.replace(hashtag_regexp, '$1');
        // console.log({ comment_text: comment_text });
       
        // console.log(this.posts[commentlist.i].comments[commentlist.k]);     
        this.posts[commentlist.i].commentData.splice([commentlist.k], 1);
        this._listService.userdeletecomment({username: commentlist.username, message: comment_text, commentId: commentlist.commentId, id: commentlist.id, postsType: commentlist.postsType })
            .subscribe();
    }

    likeStatus(liked: any): void {
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

    likedoubleClick(id: any, postsType: any, i: number) {
        if (this.posts[i].likeStatus == 0) {
            this.posts[i].likeheartFlagg = true;
            var username = localStorage.getItem('username');
            this.posts[i].postLikedBy.unshift(username);
            this.posts[i].likeStatus = 1;
            this.posts[i].likes += 1;
            this._listService.userlike(id, postsType)
                .subscribe();
            setTimeout(() => {
                this.posts[i].likeheartFlagg = false;
            }, 500);
        }
    }

    likeactive(id: any, postsType: any, i: number) {
        var username = localStorage.getItem('username');
    //    this.posts[i].postLikedBy.unshift(username);
        this.shopsPosts[i].likeStatus = 1;
        this.shopsPosts[i].likes += 1;
        this._listService.userlike(id, postsType)
            .subscribe();
             var likes=Number(this.shopsPosts[i].likes);
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
              this.shopsPosts[i].getCount=getCount;
    }
    likedeactive(id: any, postsType: any, i: number) {
     
        this.shopsPosts[i].likeStatus = 0;
        this.shopsPosts[i].likes -= 1;
        this._listService.userunlike(id, postsType)
            .subscribe();
                var likes=Number(this.shopsPosts[i].likes);
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
              this.shopsPosts[i].getCount=getCount;

    }

    following(item: any, i: number) {
        var username = item.username;
        var memberPrivateFlag = item.memberPrivateFlag;
        this.listFollowerData[i].loaderFlag = true;
        if(memberPrivateFlag == 1){
            setTimeout(() => {
                this.listFollowerData[i].followStatus = 0;
            }, 500);
            this._listService.following(username)
                .subscribe();
            setTimeout(() => {
                this.listFollowerData[i].loaderFlag = false;
            }, 500);
        }
        if(memberPrivateFlag != 1){
            setTimeout(() => {
                this.listFollowerData[i].followStatus = 1;
            }, 500);
            this._listService.following(username)
                .subscribe();
            setTimeout(() => {
                this.listFollowerData[i].loaderFlag = false;
            }, 500);
        }
    }

    follow(item: any, i: number) {
        console.log("yes inside")
        var username = item.username;
        this.listFollowerData[i].loaderFlag = true;
        setTimeout(() => {
            this.listFollowerData[i].followStatus = null;
        }, 500);
        this._listService.follow(username)
            .subscribe();
        setTimeout(() => {
            this.listFollowerData[i].loaderFlag = false;
        }, 500);
    }

    followingflag(item: any, i: number) {
        var username = item.username;
         var memberPrivateFlag = item.memberPrivateFlag;
        this.data1[i].loaderFlag = true;
        if(memberPrivateFlag == 1){
            setTimeout(() => {
                this.data1[i].followStatus = 0;
            }, 500);
            this._listService.following(username)
                .subscribe();
            setTimeout(() => {
                this.data1[i].loaderFlag = false;
            }, 500);
        }
        if(memberPrivateFlag != 1){
            setTimeout(() => {
                this.data1[i].followStatus = 1;
            }, 500);
            this._listService.following(username)
                .subscribe();
            setTimeout(() => {
                this.data1[i].loaderFlag = false;
            }, 500);
        }
        
    }

    followflag(item: any, i: number) {
        var username = item.username;
        this.data1[i].loaderFlag = true;
        setTimeout(() => {
            this.data1[i].userFollowRequestStatus = null;
        }, 500);
        this._listService.follow(username)
            .subscribe();
        setTimeout(() => {
            this.data1[i].loaderFlag = false;
        }, 500);
    }

    followingfllag(name: any, i: number) {
        this.buffer = true;
        if (this.privatemember == 1) {
            setTimeout(() => {
                this.data.userFollowRequestStatus = 0;
            }, 500);
            this._listService.privateprofile(name, this.privatemember)
                .subscribe();
            setTimeout(() => {
           this.buffer = false;
            }, 500);
        }
        if (this.privatemember != 1) {
            setTimeout(() => {
                this.data.userFollowRequestStatus = 1;
            }, 500);
            this._listService.following(name)
                .subscribe();
            setTimeout(() => {
               this.buffer = false;
            }, 500);
        }

    }

    followfllag(name: any, i: number) {
        this.buffer = true;
        setTimeout(() => {
            this.data.userFollowRequestStatus = null;
        }, 500);
        this._listService.follow(name)
            .subscribe();
        setTimeout(() => {
            this.buffer = false;
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

            this._listService.usercomment({ message: value, id: id, postsType: postsType })
                .subscribe((res) => {
                this.submitComment = res.data; 
                this.posts[i].commentData.push(this.submitComment[0].commentData[0]);
                this.hashtagFunction(); 
            });
        }
    }
    filter(cat: string, index: any) {
        var res = this.listArr;
        this.shopsPosts = [];
        var username = localStorage.getItem('username');
        this.activelistIndex = index
        this.aI = index;
        this.getListDetails(res[index].id);
        if(res[index].properties.ownerName == this.username) {
            this.role = 'self'
        }else {
            this.role = 'other';
        }
        var newurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/lists/'+this.listArr[index].name;
        window.history.replaceState(null,null,newurl);
    }

    usersearchSubmit(value: any, data:any) {
    // console.log(this.userData);
    var searchname = '';
    if(value.charAt(0) == '#'){
      let link = ['caption', searchname];
      this._router.navigate(link);
      this.blur_close = false;
    }else if(value.charAt(0) != '#'){
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
    console.log('blured');
    setTimeout(() => {
      jQuery("#searchProd").val('');
      this.blur_close = false;
    }, 200);
  }
  searchopen() {
    this.blur_close = true;
  }
  onKey(value: string) {
    if(value != '') {
        this._listService.searchMyLists(value, 10, 0)
        .subscribe((res) => {
            this.fItems = res.data;
        })
    }else {
        this.fItems = [];
    }
    
  }

  setFilteredItems(value: string) {
        value=value.toLowerCase();
        var username = '', postCaption = '', hashtags = '', productName = '', categoryTags = '';
        this.fItems = this.searhList.filter((item: any) => {
            if(item.username){
                username = item.username.toLowerCase();
            }
            if(item.postCaption){
                postCaption = item.postCaption.toString().toLowerCase();
            }
            if(item.hashTags){
                hashtags = item.hashTags.toLowerCase();
            }
            if(item.productName){
                productName = item.productName.toLowerCase();
            }
            if(item.categoryTags){
                categoryTags = item.categoryTags.toString().toLowerCase();
            }
            return username.indexOf(value) > -1 || postCaption.indexOf(value) > -1 || hashtags.indexOf(value) > -1 || productName.indexOf(value) > -1 || categoryTags.indexOf(value) > -1;
        }); 
        console.log(this.fItems);
    }

        left() {
        var strid = jQuery('.item.active').prev().attr("id");
        if(!strid){
            var strid =  jQuery('.item:last').attr("id")
        }
         
        if(strid){
            var id = strid.substr(0, strid.length -1)
            this.listsCountFun(id);
            this.likeCountFun(id); 
            var data= this.shopsPosts.filter(function (item: any) {
                 if(item.postId==id){
                    return item;
                 }
            });

        if (history.pushState) {
            if(data[0].productName){
                 var backurl = window.location.protocol + "//" + window.location.host + '/' + data[0].postedByUserName +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + data[0].postedByUserName +'/shop/'+id;
            }
            else{
                var backurl = window.location.protocol + "//" + window.location.host + '/' + data[0].postedByUserName +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + data[0].postedByUserName +'/'+id;
            }
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
            this.listsCountFun(id);
            this.likeCountFun(id); 
             var data= this.shopsPosts.filter(function (item: any) {
                 if(item.postId==id){
                    return item;
                 }
            });
          
        if (history.pushState) {
            if(data[0].productName){
               
                var backurl = window.location.protocol + "//" + window.location.host + '/' + data[0].postedByUserName +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + data[0].postedByUserName +'/shop/'+id;
            }
            else{
                 var backurl = window.location.protocol + "//" + window.location.host + '/' + data[0].postedByUserName +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + data[0].postedByUserName +'/'+id;
            }
            //window.history.pushState({path:backurl},'',backurl);
             this.lcount=0;
            window.history.replaceState(null,null,newurl);
        }
        }  
    }

    listsCountFun(postId: any) {
        this._listService.listCount(postId)
        .subscribe((res) => {
            this.loading = false;
            this.listsCount = res[0].count;
            console.log(this.listsCount);
        });
    }
    
    likeCountFun(postId: any) {
        this._listService.likeCount(postId)
        .subscribe((res) => {
            this.loading = false;
            if(res.code != 56713) {
                this.likeCount = res[0].count
            } else {
                this.likeCount = 0;
            }
            console.log(this.likeCount);
        });
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
        this._listService.deletePost(this.deleteId)
                .subscribe((res) => {
                  console.log(res);
                  var newurl = window.location.protocol + "//" + window.location.host +'/'+this.name+'/lists';
                    window.history.pushState(null,null,newurl);
                 this.dltMsg="Post deleted successfully.";
                 this.dltType='success';
                 this.buffer_dlt=false;
                   jQuery(".modal").fadeOut(1500);
                   jQuery(".modal-backdrop").css({ "display": "none" }).fadeOut(1500);
                   setTimeout(() => {
                    this.shopsPosts.splice(this.dltIndex, 1);
                      this.dltMsg="Are you sure you want to delete post?";
                   this.dltType='warning';
                  }, 2500);
                
                 
                });
    }
     postCaption:any='Share your posts at merriment.io'
      imageUrl:any="http://merriment.io/public/images/pico_logo_new.png";
    shareFun(i:any, data:any) {
        this.aind = i;
        if(this.shopsPosts[i].postedByUserName==this.username &&  !this.shopsPosts[i].productName){
          this.isOwner=false;
           this.dltIndex=i;
          this.deleteId=this.shopsPosts[i].postId;
          this.updateUrl=  ['', 'updatepost/'+this.shopsPosts[i].postId];
         }
         else{
              this.isOwner=true;
         }
        this.imageUrl=data.mainUrl;
        this.postCaption=data.description;
         var url = window.location.protocol + "//" + window.location.host + window.location.pathname +'?ref='+ this.username;
    
        this._listService.shortUrl(url)
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

    setPrivacy(role: string, roleId: number, isF: number, id: number) {
        console.log(role, roleId, isF, id);
        if(role == 'self') {
            if(roleId == 1) {
                this._listService.changeRole(id, 2).subscribe((res) => {
                    this.listArr[this.aI].properties.role = 2
                })
                
            } else if(roleId == 2) {
                this._listService.changeRole(id, 3).subscribe((res) => {
                    this.listArr[this.aI].properties.role = 3
                })
            }else {
                this._listService.changeRole(id, 1).subscribe((res) => {
                    this.listArr[this.aI].properties.role = 1
                })
            }
        }else {
            if(isF == 0) {
                this.loadingF = true;
               this._listService.followList(id, this.username).subscribe((res) => {
                   this.listArr[this.aI].isFollowList = 1;
                   this.listArr[this.aI].followerCount += 1;
                   this.loadingF = false;
               })
            } else {
                this.loadingF = true;
               this._listService.unfollowList(id, this.username).subscribe((res) => {
                    this.listArr[this.aI].isFollowList = 0;
                    this.listArr[this.aI].followerCount -= 1;
                   this.loadingF = false;
               })

            }
        }
        
    }
	moveLeft() {
        event.preventDefault();
        jQuery('#container').animate({
            scrollLeft: "-=200px"
        }, "slow");
    }

    moveRight() {
        event.preventDefault();
        jQuery('#container').animate({
            scrollLeft: "+=200px"
        }, "slow");
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

detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

showAddList() {
        jQuery("#hideShowLable").css({'width':'0'});
    }
    getActiveID(id: any){
        this.aPostId = id;
        this.getListInfo(id);
        console.log(id);
    }
    addnewlist(){
        console.log(this.newListname);
        this._listService.createList(this.username, this.newListname)
        .subscribe((res) => {
            if(res.code == 200) {
                this.getListInfo(this.aPostId);
            }
        })
    }

    addToList(listID:any, sel:any, ui:any) {
        var postID = this.aPostId;
        var len = this.shopsPosts.length;
        var index = 0;
        for(var i=0; i<len; i++) {
            if(this.shopsPosts[i].postId == postID) {
                index = i;
            }
        }
        if(sel == 0) {
            this._listService.addPostToList(listID,postID)
            .subscribe((res) => {
                console.log(res);
                if(res.code == 200) {
                    this.userLists[ui].selected = 1;
                    this.shopsPosts[index].listsCount += 1;
            var list=Number(this.shopsPosts[index].listsCount);
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
              this.shopsPosts[index].getListCount=getListCount;
                    this.listStatus(index);
                }
            })
        }  else {
            this._listService.removePostFromList(listID,postID)
            .subscribe((res) => {
                console.log(res);
                if(res.code == 200) {
                    this.userLists[ui].selected = 0;
                    this.shopsPosts[index].listsCount -= 1;
                       var list=Number(this.shopsPosts[index].listsCount);
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
              this.shopsPosts[index].getListCount=getListCount;
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
            this.shopsPosts[index].listStatus = true;
        } else {
            this.shopsPosts[index].listStatus = false;
        }
    }

    onNavigate(url:any){
        window.open("http://"+url, "_blank");
    }

   getListFolower(){
       var id = this.listArr[this.aI].id;
       console.log(id);
       this.listFollowerData = [];
       this._listService.getListFollowers(id)
       .subscribe((res) => {
           if(res.code == 200) {
               console.log("get flower");
               console.log(res.data);
               this.listFollowerData = res.data;
           }
       })
   }

   getListDetails(listID: any) {
       this.shopsPosts = [];
        this._listService.getListDetails(listID)
        .subscribe((res) => {
            var data = res.data;
            var plen = data.length;
            for(var j=0; j<plen; j++) {
                if(data[j].postId) {
                    this.shopsPosts.push(data[j]);
                }
            }
            this.totaldata=this.shopsPosts;
            this.commentfunction();
        })
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
          postId:this.shopsPosts[this.aind].postId,
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

/**================Validate Image Url======================= */
 checkImgURL(url:string) {
   if(url.match(/\.(jpeg|jpg|gif|png)$/) ==null){
     url="/public/images/user.jpg"

   }
    return url;
 }

 twitterShare() {
        jQuery('#twtrShare').modal('show');
        jQuery('#myModall').modal('hide');
        this.twtrText = this._uTiService.setTwitterText(this.shopsPosts[this.aind], this.repoUrl);
    }
    tweet() {
        var file = this.shopsPosts[this.aind].mainUrl
        this._uTiService.previewFile(file, this.twtrText);
    }

}
