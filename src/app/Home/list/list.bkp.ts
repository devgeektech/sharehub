import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router, ActivatedRoute  } from '@angular/router';
import {listService} from '../list/list.service';
import { Observable } from 'rxjs/Observable';
import {HeaderComponent} from '../../header/header.component';
declare const jQuery: any;
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { CeiboShare } from 'ng2-social-share';
import {TruncatePipe} from '../../pipes/truncate.pipe';

@Component({
    selector: 'list',
    templateUrl: '/list.component.html',
    directives: [ROUTER_DIRECTIVES, HeaderComponent, CeiboShare],
     pipes: [TruncatePipe],
    providers: [listService]
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
    constructor(private _listService: listService, private _router: Router, private route: ActivatedRoute) {
        
    }

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
            this._listService.personprofile(this.name)
                .subscribe((res) => {
                    if(res.code == 1800){
                      this.persondata = false;
                      this.personnodata =true;
                    }
                     if(res.code == 200){
                        this.persondata = true;
                        this.personnodata =false;
                        this.loading = false;
                        this.data = res.memberProfileData[0]; 
                        console.log("profiledata")
                        console.log(this.data);                       
                        // console.log(this.privatemember);
                        // this.posts = res.memberPostsData;
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
                        this.privatemember = this.data.privateMember

                        this.posts=[];
                        // this.totaldata = res.memberPostsData;
                        this.offset = res.memberPostsData.length;

                      //  this.commentfunction();

                        if (this.offset >= 20)
                            this.loadmoree = true;
                     }
                });
            this._listService.memberFollowing(this.name)
                .subscribe((res) => {
                    this.data1 = res.following;
                    this.loading = false;
                });

            this._listService.memberFollowers(this.name)
                .subscribe((res) => {
                    this.data2 = res.memberFollowers;
                    this.loading = false;
                });

            this._listService.getUserList(this.name).subscribe((res) => {
                var len = res.length;
                this.Alldata = res;
                this.shopsPosts = [];
                this.listArr = [];
                this.activelistIndex = 0
                var username = localStorage.getItem('username');
                var ownArr:any = [];
                var otherArr:any = [];
                var temp1Arr:any = [];
                var temp2Arr: any = [];
                if(this.username != this.name) {
                    for(var i=0; i<len; i++) {
                        if(res[i].list.properties.ownerName == this.name) {
                           var nm = res[i].list.properties.name
                            if(nm == "wishList") {
                                nm = " Wish List"
                            }
                            temp1Arr.push(res[i]);
                            ownArr.push({
                                'name':nm,
                                'id':res[i].list.properties.id
                            }); 
                        }
                    }
                    this.tempArr = temp1Arr;
                    this.listArr = ownArr;
                    
                } else {
                    for(var i=0; i<len; i++) {
                    if(res[i].list.properties.ownerName != username) {
                        var nm = res[i].list.properties.name
                        if(nm == "wishList") {
                            nm = " Wish List by "+res[i].list.properties.ownerName
                        } else {
                            nm = nm +" by "+res[i].list.properties.ownerName
                        }
                        temp2Arr.push(res[i]);
                        otherArr.push({
                            'name':nm,
                            'id':res[i].list.properties.id
                        });
                    } else {
                        var nm = res[i].list.properties.name
                        if(nm == "wishList") {
                            nm = " Wish List"
                        }
                        temp1Arr.push(res[i]);
                        ownArr.push({
                            'name':nm,
                            'id':res[i].list.properties.id
                        });
                    } 
                    }
                    this.tempArr = temp1Arr.concat(temp2Arr);
                    this.listArr = ownArr.concat(otherArr);
                }

                for(var i=0; i<len; i++) {
                    for(var t=0; t<res[i].posts.length; t++){
                        if(res[i].posts[t].postId) {
                            this.searhList.push(res[i].posts[t]);
                        }
                    }
                    if(res[i].list.properties.id == this.listArr[0].id) {
                        var plen = res[i].posts.length;
                            for(var j=0; j<plen; j++) {
                                if(res[i].posts[j].postId) {
                                    this.shopsPosts.push(res[i].posts[j]);
                                }
                            }
                    }
                }
                 this.totaldata=this.shopsPosts;
                 //this.shopsPosts=[];
                 this.commentfunction();
                this.fItems = this.searhList;
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

    //     this._listService.getUserList(username)
    // .subscribe((res) => {
    //     this.userLists = res;
    // });

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
            if (this.totaldata[i].postCaption) {
                var postCaptionn = this.totaldata[i].postCaption.split(',');
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
            if (sponProductTags[0] != 'undefined' && sponProductCoordinates[0] != null) {
                var lenn = sponProductTags.length;
                var tagsCords: any = [];
                for (var j = 0; j < lenn; j++) {
                    var productCords = {
                        name: sponProductTags[j],
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

            newData.push(this.totaldata[i]);
        }
        this.shopsPosts = newData;
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
        var postsId = item.postId;
        var followingUsername = this.name;
        let link = ['', followingUsername, postsId];
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
         if(this.shopsPosts[i].sponProductTags){
        if (this.shopsPosts[i].sponProductTags[0] != 'undefined' && this.shopsPosts[i].sponProductCoordinates[0] != null && this.shopsPosts[i].sponProductTags.length > 0 && this.shopsPosts[i].sponProductCoordinates.length > 0 && this.shopsPosts[i].sponProducts.length > 0) {
            var lenn = this.shopsPosts[i].sponProducts.length;
           if(lenn>0){
                jQuery("#pp_"+this.shopsPosts[i].postId).slideToggle("fast");
                  this.sponLen=false;
              }
            for (var k = 0; k < lenn; k++) {
                var productCords = {
                    imageUrl: this.shopsPosts[i].sponProducts[k].mainUrl,
                    name: this.shopsPosts[i].sponProducts[k].productName + ' by ' + this.shopsPosts[i].sponProducts[k].owner.username,
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
                    tagsCords.push(productCords);
                }
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
          if(this.sponLen==false){
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
        console.log(pid, type, data);
        if(!this.onTagClick){
            this.id=pid;
         var urlchunks = window.location.pathname.split('/');
        var username = urlchunks[1];  
        if(data.productUrl==null){
            if(type==1){
            if (history.pushState) {
                 var backurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/' +this.id;
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
                 var backurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/shop/'+this.id;
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
        // alert(id);
        localStorage.setItem('showProduct', JSON.stringify(this.shopsPosts));
        localStorage.setItem('productId', pid);
        let link = [this.name+'/', pid];
        this._router.navigate(link);
        jQuery('.item').removeClass("active");
        jQuery('#' + pid + 'w').addClass("active");
    }

    memberprofile(item: any): void {
        // alert(item.postsId);
        var personname = item.username;
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
            this._listService.userlike(id, postsType)
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
        this._listService.userlike(id, postsType)
            .subscribe();
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
        this._listService.userunlike(id, postsType)
            .subscribe();

    }

    following(item: any, i: number) {
        // alert(i+'ll'+username+'ff'+followFlag);
        var username = item.username;
        var memberPrivateFlag = item.memberPrivateFlag;
        this.data2[i].loaderFlag = true;
        if(memberPrivateFlag == 1){
            setTimeout(() => {
                this.data2[i].userFollowRequestStatus = 0;
            }, 500);
            this._listService.following(username)
                .subscribe();
            setTimeout(() => {
                this.data2[i].loaderFlag = false;
            }, 500);
        }
        if(memberPrivateFlag != 1){
            setTimeout(() => {
                this.data2[i].userFollowRequestStatus = 1;
            }, 500);
            this._listService.following(username)
                .subscribe();
            setTimeout(() => {
                this.data2[i].loaderFlag = false;
            }, 500);
        }
    }

    follow(item: any, i: number) {
        var username = item.username;
        this.data2[i].loaderFlag = true;
        setTimeout(() => {
            this.data2[i].userFollowRequestStatus = null;
        }, 500);
        this._listService.follow(username)
            .subscribe();
        setTimeout(() => {
            this.data2[i].loaderFlag = false;
        }, 500);
    }

    followingflag(item: any, i: number) {
        var username = item.username;
         var memberPrivateFlag = item.memberPrivateFlag;
        // alert(i+'ll'+username+'ff'+followFlag);
        this.data1[i].loaderFlag = true;
        if(memberPrivateFlag == 1){
            setTimeout(() => {
                this.data1[i].userFollowRequestStatus = 0;
            }, 500);
            this._listService.following(username)
                .subscribe();
            setTimeout(() => {
                this.data1[i].loaderFlag = false;
            }, 500);
        }
        if(memberPrivateFlag != 1){
            setTimeout(() => {
                this.data1[i].userFollowRequestStatus = 1;
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
        // alert(i+'ll'+username+'ff'+followFlag);
        // console.log(this.privatemember);
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
        var len = this.Alldata.length;
        //var res = this.Alldata;
        var res = this.tempArr
        this.shopsPosts = [];
        var username = localStorage.getItem('username');
        this.activelistIndex = index
        this.aI = index;
        // for(var i=0; i<len; i++) {
        //       if(res[i].list.properties.id == cat) {
                  
        //         var plen = res[i].posts.length;
        //         if(res[i].list.properties.ownerName == this.username) {
        //             this.role = 'self'
        //         }else {
        //             this.role = 'other';
        //         }
        //         for(var j=0; j<plen; j++) {
        //             if(res[i].posts[j].postId) {
        //                 this.shopsPosts.push(res[i].posts[j]);
        //             }
        //         }
        //     }
        // }
        for(var i=0; i<res[index].posts.length; i++) {
            if(res[index].posts[i].postId) {
                this.shopsPosts.push(res[index].posts[i]);
            }
        }
          this.totaldata=this.shopsPosts;
          //this.shopsPosts=[];
          this.commentfunction();
        if(res[index].list.properties.ownerName == this.username) {
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
    // alert("hai");
    console.log('blured');
    setTimeout(() => {
      jQuery("#searchProd").val('');
      this.blur_close = false;
    }, 200);
  }
  searchopen() {
    // alert("hi");
    this.blur_close = true;
  }
  onKey(value: string) {
    if(value != '') {
        this.setFilteredItems(value);
    }else {
        this.fItems = this.searhList;
    }
    console.log(this.fItems, value);
    
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
           console.log(id)
            var data= this.shopsPosts.filter(function (item: any) {
                 if(item.postId==id){
                    return item;
                 }
            });
            console.log(data);
        if (history.pushState) {
            if(data[0].productName){
                 var backurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/shop/'+id;
            }
            else{
                var backurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/'+id;
            }
                
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
            this.listsCountFun(id);
            this.likeCountFun(id); 
             var data= this.shopsPosts.filter(function (item: any) {
                 if(item.postId==id){
                    return item;
                 }
            });
          
        if (history.pushState) {
        console.log("yes insdie");
        console.log(data[0].productName);
            if(data[0].productName){
               
                var backurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/shop/'+id;
            }
            else{
                 var backurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/lists';
                 var newurl = window.location.protocol + "//" + window.location.host + '/' + this.name +'/'+id;
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

    shareFun() {
        var url = window.location.protocol+"//"+ window.location.host + window.location.pathname
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
        console.log(role, roleId);
        if(role == 'self') {
            if(roleId == 1) {
                this._listService.changeRole(id, 2).subscribe((res) => {
                    this.tempArr[this.aI].list.properties.role = 2
                })
                
            } else if(roleId == 2) {
                this._listService.changeRole(id, 3).subscribe((res) => {
                    this.tempArr[this.aI].list.properties.role = 3
                })
            }else {
                this._listService.changeRole(id, 1).subscribe((res) => {
                    this.tempArr[this.aI].list.properties.role = 1
                })
            }
        }else {
            if(isF == 0) {
                this.loadingF = true;
               this._listService.followList(id, this.username).subscribe((res) => {
                   this.tempArr[this.aI].isFollowList = 1;
                   this.tempArr[this.aI].followerCount += 1;
                   this.loadingF = false;
               })
            } else {
                this.loadingF = true;
               this._listService.unfollowList(id, this.username).subscribe((res) => {
                    this.tempArr[this.aI].isFollowList = 0;
                    this.tempArr[this.aI].followerCount -= 1;
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
    copyToClipboard(element:any) {
    var $temp = jQuery("<input>");
    jQuery("body").append($temp);
    $temp.val(jQuery(element).text()).select();
    document.execCommand("copy");
     this.isCopied = true;
   setTimeout(() => {
            this.isCopied = false;
          }, 1000);
    $temp.remove();
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
               this.listFollowerData = res.data;
           }
       })
   }

}
