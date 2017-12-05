import { Component, ElementRef, HostListener } from '@angular/core';
//import { HomeService } from '../content/home.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router } from '@angular/router';
import { InfiniteScroll } from 'angular2-infinite-scroll';
import { HeaderService } from '../../header/header.service';
import { HeaderComponent } from '../../header/header.component';
import { CreatePostService } from '../createpost/createpost.service';
import { CeiboShare } from 'ng2-social-share';
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ClickOutside } from '../createpost/click-outside.directive';
//  import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';

declare const jQuery: any;
declare const google: any;
declare const FB: any;

@Component({
  selector: 'createpost',
  templateUrl: './createpost.component.html',
   host: {
    '(document:keyup)': 'onDocumentKeyUp($event)'
  },
  directives: [ROUTER_DIRECTIVES, HeaderComponent, CeiboShare, REACTIVE_FORM_DIRECTIVES,ClickOutside],
  providers: [HeaderService, CreatePostService],
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})

export class CreatepostComponent {

  sponsoredForm: any;
  standaredForm: any;
  productForm: any;
  geocoder: any;
  constructor(el: ElementRef, private _headerService: HeaderService, private _postService: CreatePostService, private _router: Router, private formBuilder: FormBuilder) {
    this.standaredForm = this.formBuilder.group({
      'postCaption': ['']
    });
    this.sponsoredForm = this.formBuilder.group({
      'postCaption': ['']
    });
    this.productForm = this.formBuilder.group({
      'postCaption': [''],
      'price': ['', Validators.required],
      'productName': ['', Validators.required],
      'category': ['', Validators.required],
      'productUrl': [''],
      'buttonLabel': ['']
    });
  }

  google: any;
  private loading = true;
  loaded: boolean = false;
  imageLoaded: boolean = false;
  hidden: boolean = false;
  isLoaded: boolean = true;
  isClickon: boolean = true;
  taggingDone: boolean = true;
  isUserTaggedIn: boolean = true;
  isSponsoredTaggedIn: boolean = true;
  isproductTaggedIn: boolean = true;
  standardLocation: boolean = true;
  sponsoredLocation: boolean = true;
  productLocation: boolean = true;
  imageSrc: string = '';
  tagTitle1: string = "Tag People";
  tagTitle2: string = "Tag People";
  tagTitle3: string = "Tag People";
  tagProductTitle: string = "Tag Product";
  x: any;
  y: any;
  x_cord: any;
  y_cord: any;
  private uploaDing:boolean = false;
  private values = '';
  private limit = 10;
  private offset = 0;
  private data = 0;
  private sponData = 0;
  private blur_close = false;
  private activity: any;
  private userData: any;
  search_person = false;
  search_hashtag = false;
  search_location = false;
  longLat: any;
  match: any;
  matches: any = [];
  userTagsArr: any = [];
  coordsImage: any = [];
  userTagsCoordsArr: any = [];
  finelUserCoordsArr: any = [];
  getSponUser: any = [];
  repoUrl: string = 'merriment.io';
  error = true;
  success = true;
  msg: string = '';
  sponsorList: any = [];
  sponsorListCopy: any = [];
  sponsorProductList: any = [];
  sponsorProductListCopy: any = [];
  sponProductTagsArr: any = [];
  sponProductCoordinatesArr: any = [];
  sponsoredUserName: string = '';
  productImageUrl: string = '';
  coordData: any;
  imgWidth: any;
  imgHeight: any = 362;
  isBusiness:any;
  sponArr: any = [];
  peopleArr: any = [];  
  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';
  iconColor: any;
  dragging: boolean = false;
  loaded1: boolean = false;
  imageLoaded1: boolean = false;
  imageSrc1: string = '';
  borderColor: any;
  catData:any;
  catLen:any=0;
  catDataCopy:any;
  selectedCatArr:any=[];
  thumbUrl:any;
  mainImgUrl:any;
  isSponsoredPostType:boolean=true;
  percentComplete:any = 0;
  error_url:boolean=true;
  sugestionShow:boolean=true;
  ngOnInit() {
    if(localStorage.getItem('setToPro')) {
      setTimeout(function() {
        jQuery("#productId").click();
        localStorage.removeItem('setToPro');
      }, 1000);
    }
    var token = localStorage.getItem('authToken');
   
    this.initMap();
    if (!token) {
      this._router.navigate(["login"]);
    }
 

   

    this._headerService.recentactivitypeople(this.limit, this.offset)
      .subscribe((res) => {
        this.activity = res.data;
      });
    this._postService.getMySponsors()
      .subscribe((res) => {
        console.log(res);
          console.log("res above spon");
        this.sponData = res.data.length;
         this.isBusiness =  res.data.memberProfileData.businessProfile;
       var data = res.data.result;
        for(var i=0; i<data.length; i++){
          if((data[i].MarketingEnable==1 && data[i].isApproved==1) || data[i].username==   res.data.memberProfileData.username){
            this.sponsorList.push(data[i]);
          }
        }
        this.sponsorListCopy = this.sponsorList;
            this.loading = false;
      });

        this._postService.getCategory()
        .subscribe((res) => {
          console.log("all Category");
          console.log(res);
          let catArr:any=[];
          for(var i=0;i<res.data.length;i++){
            if(res.data[i].name !=null){
              catArr.push(res.data[i]);
            }
          }
          this.catDataCopy =catArr;
        });

 
        
  }

onDocumentKeyUp(ev: KeyboardEvent) {
 if(ev.key=='Escape'){
   this.taggingDoneFun();
 }
   if ((ev.srcElement.id=='catId' || ev.srcElement.classList[3]=='aaa') && ev.key == "ArrowDown") { 
        if(jQuery('.aaa').hasClass("focused")){
          jQuery('.focused').removeClass('focused').next('.aaa').focus().addClass('focused');
        }
        else{
           jQuery('.aaa:first').focus().addClass('focused');
        }
           
    }
       if ((ev.srcElement.id=='catId' || ev.srcElement.classList[3]=='aaa') && ev.key == "ArrowUp") {  
        if(jQuery('.aaa').hasClass("focused")){
          jQuery('.focused').removeClass('focused').prev('.aaa').focus().addClass('focused');
        }
        else{
           jQuery('.aaa:last').focus().addClass('focused');
        }
           
    }
    if((ev.srcElement.id=='catId' || ev.srcElement.classList[3]=='aaa') && (ev.key == "ArrowUp" || ev.key == "ArrowDown")){
          this.sugestionShow=true;
    }else{
       jQuery('.focused').removeClass('focused');
       this.sugestionShow=false;
    }


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
  //  @HostListener('mouseover')
  //   onMouseOver() {
  //     alert("yes working")
  //   }
  blursearch() {
    setTimeout(() => {
      jQuery("#searchPico").val('');
      this.blur_close = false;
    }, 200);
  }
  searchopen() {
    this.blur_close = true;
  }
 
  isSponsoredPostFun(type:any){
    if(type==1){
        this.isSponsoredPostType=false;
    }
    else{
        this.isSponsoredPostType=true;
    }
  
  }
  tagTitle(i: number) {
    this.isproductTaggedIn = true;
    if (this.isUserTaggedIn == true) {

      this.tagProductTitle = "Tag Product";
      if (i == 1) {
        this.isUserTaggedIn = false;
        this.tagTitle1 = "Click on image to tag";
      }
      else if (i == 2) {
        this.isUserTaggedIn = false;
        this.tagTitle2 = "Click on image to tag";
      }
      else if (i == 3) {
        this.isUserTaggedIn = false;
        this.tagTitle3 = "Click on image to tag";
      }
      else{
        this.isUserTaggedIn = false;
        this.tagTitle3 = "Click on image to tag"; 
      }
      this.isSponsoredTaggedIn = true
    }
    else {
      if (i == 1) {
        this.tagTitle1 = "Tag People";
      }
      else if (i == 2) {
        this.tagTitle2 = "Tag People";
      }
      else if (i == 3) {
        this.tagTitle3 = "Tag People";
      }
      else{
        this.tagTitle1 = "Tag People";
         this.tagTitle2 = "Tag People";
          this.tagTitle3 = "Tag People";
      }
      this.isUserTaggedIn = true;
      this.isClickon = true;
    }

  }
  tagProduct() {
    if (this.isproductTaggedIn == true) {
      if (this.isSponsoredTaggedIn == true) {
        this.tagTitle1 = "Tag People";
        this.tagTitle2 = "Tag People";
        this.tagTitle3 = "Tag People";
        this.isUserTaggedIn = true;
        this.tagTitle3 = "Tag People";
        this.tagProductTitle = "Click on image to tag";
        this.isSponsoredTaggedIn = false
      }
      else {
        this.tagTitle1 = "Tag People";
        this.tagTitle2 = "Tag People";
        this.tagTitle3 = "Tag People";
        this.isUserTaggedIn = true;
        this.tagProductTitle = "Tag Product";
        this.isSponsoredTaggedIn = true;
        this.isClickon = true;
      }
    }



  }
  businessName:string;
  sponsoredTagged(item: any) {
    this.sponsoredUserName = item.username;
      this.businessName = item.businessName;
    var data = {
      'username': item.username
    }
    this._postService.getProductsOffered(data)
      .subscribe((res) => {
        this.sponsorProductList = res.data;
        this.sponsorProductListCopy = res.data;
        this.isSponsoredTaggedIn = true;
        this.isUserTaggedIn = true;
        this.isproductTaggedIn = false;
        jQuery("#searchSponsored").val('');
      });


  }

  porductTagged(item: any) {
    if (this.sponsoredUserName != '') {
     
      var height = jQuery("#previewImage").height();
      var width = jQuery("#previewImage").width();
      var y = this.y_cord;
      var x = this.x_cord;
         this.y_cord = (parseFloat(this.y_cord)+4)/ height;
    this.x_cord = (parseFloat(this.x_cord)+1.5) / width;
      var dataObj = {
        'name': this.businessName,
        'top': y - height,
        'left': x,
        'imageUrl': item.mainUrl,
        'productName': item.productName,
        'isRight': false
      }

      dataObj['top'] = dataObj.top + 4;
      if (x > width / 2) {
        dataObj['isRight'] = true;
        dataObj['left'] = width - dataObj.left;
        dataObj['left'] = dataObj['left'] - 11;
      }
      else {
        dataObj['left'] = dataObj.left - 9;
      }
      this.coordsImage.push(dataObj);
      this.sponArr.push(dataObj);
      this.getSponUser.push(this.sponsoredUserName);
      var getSponTag = [item.postId, this.sponsoredUserName]
      this.sponProductTagsArr.push(getSponTag);
      var getCordarr = [this.x_cord, this.y_cord];
      this.sponProductCoordinatesArr.push(getCordarr);
      this.isClickon = true;
    }
    this.isSponsoredTaggedIn = false;
    this.isproductTaggedIn = true;
    this.sponsorList = this.sponsorListCopy;
    this.sponsorProductList = [];
    jQuery("#searchProduct").val('');
  }
  filterCatgory(value: any) {
    if (!value) {
      this.catData = this.catDataCopy;
    }; //when nothing has typed
    this.catData = this.catDataCopy.filter(function (item: any) {
      return item.name.indexOf(value) >= 0;
    });
    this.catLen = this.catData.length;
  }
  selectedCategoryFun(item:any){
    console.log(item);
    if(item.name){
    this.selectedCatArr.push(item.name);
  }
  else{
     this.selectedCatArr.push(item);
  }
      jQuery("#catId").val('');
      this.catLen=0;
  }
  removeCat(i:any){
      this.selectedCatArr.splice(i, 1);
  }
  filterSponsoredUser(value:any){
    console.log("yes inside")
    if (!value) {
      this.sponsorList = this.sponsorListCopy
    }; //when nothing has typed
    value=value.toString().toLowerCase();
    this.sponsorList = this.sponsorListCopy.filter(function (item: any) {
      var user=item.username.toString().toLowerCase();
      return user.indexOf(value) >= 0;
    });
    this.sponData = this.sponsorList.length;
    console.log(this.sponData);
  }

  filterSponsoredProduct(value: any) {
    if (!value) {
      this.sponsorProductList = this.sponsorProductListCopy;
    }; //when nothing has typed
    if(this.sponsorProductListCopy){
      value=value.toString().toLowerCase();
    this.sponsorProductList = this.sponsorProductListCopy.filter(function (item: any) {
     var product=item.productName.toString().toLowerCase();
      return product.indexOf(value) >= 0;
    });
    this.sponData = this.sponsorProductList.length;
    }
  }

  getCoordinates(e: any) {
    var $div = jQuery(e.target);
    var offset = jQuery("#previewImage").offset();
    this.x = e.pageX - offset.left;
    this.y = e.pageY - offset.top;
    if (this.x < 0) {
      this.x = this.x * (-1);
    }
    if (this.y < 0) {
      this.y = this.y * (-1);
    }
    this.x = this.x - 1.5;
    this.y = this.y - 2.5;
    this.x_cord = this.x.toString();
    this.y_cord = this.y.toString();
    if (window.innerWidth < 768) {
      this.y = 0;
      this.x = 0;
    }
    if (this.isUserTaggedIn == false || this.isproductTaggedIn == false || this.isSponsoredTaggedIn == false) {
      this.isClickon = false;
      this.taggingDone = false;
    }

  };
  taggingDoneFun() {
    this.isClickon = true;
    this.taggingDone = true;
    this.tagProduct();
     this.tagTitle(4);
  }

  userTagged(item:any) {
    if( this.isSponsoredPostType){
      var name=item.membername;
    }
    else{
      var name=item.username;
    }
    var height = jQuery("#previewImage").height();
    var width = jQuery("#previewImage").width();
    var y = this.y_cord;
    var x = this.x_cord;
  //  console.log(parseFloat(this.y_cord)+5)
    this.y_cord = (parseFloat(this.y_cord)+4)/ height;
    this.x_cord = (parseFloat(this.x_cord)+1.5) / width;
    var dataObj = {
      'name': name,
      'top': y - height,
      'left': x,
      'isRight': false,
    }
    dataObj['top'] = dataObj.top + 4;
    if (x > width / 2) {
      dataObj['isRight'] = true;
      dataObj['left'] = width - dataObj.left;
      dataObj['left'] = dataObj['left'] - 11;
    }
    else {
      dataObj['left'] = dataObj.left - 9;
    }
    this.coordsImage.push(dataObj);
    this.peopleArr.push(dataObj);
    this.userTagsArr.push(name);
    var getCordarr = [this.x_cord, this.y_cord];
    this.userTagsCoordsArr.push(getCordarr);
    this.isClickon = true;
    this.data = null;
  }
  deleteTag(item: any) {
    let index: number = this.coordsImage.indexOf(item);
    if (index !== -1) {
      this.coordsImage.splice(index, 1);

      if (item.productName) {
        let index2: number = this.sponArr.indexOf(item);
         this.sponArr.splice(index2, 1);
         this.getSponUser.splice(index2, 1);
        this.sponProductTagsArr.splice(index2, 1);
        this.sponProductCoordinatesArr.splice(index2, 1);
      }
      else {
        let index1: number = this.peopleArr.indexOf(item);
        this.peopleArr.splice(index1, 1);
        this.userTagsCoordsArr.splice(index1, 1);
        this.userTagsArr.splice(index1, 1);
      }
    }
  }

  initMap() {
    var input1 = document.getElementById('pac-input1');
    var input2 = document.getElementById('pac-input2');
    var input3 = document.getElementById('pac-input3');
    var autocomplete = new google.maps.places.Autocomplete(input1);
    autocomplete = new google.maps.places.Autocomplete(input2);
    autocomplete = new google.maps.places.Autocomplete(input3);
    autocomplete.addListener('place_changed', function () {
    
      var place = autocomplete.getPlace();
    });
  }
  addSponsoredLocation() {
    if (this.sponsoredLocation) {
      this.sponsoredLocation = false;
    }
    else {
      this.sponsoredLocation = true;
    }
  }
  addStandardLocation() {
    if (this.standardLocation) {
      this.standardLocation = false;
    }
    else {
      this.standardLocation = true;
    }
  }
  addProductLocation() {
    if (this.productLocation) {
      this.productLocation = false;
    }
    else {
      this.productLocation = true;
    }
  }

  createStandaredPost(results: any) {

    if (this.imageSrc == '') {
      this.error = false;
      this.msg = "Please Upload Image First";
      setTimeout(() => {
        this.error = true;
        this.msg = "";
      }, 1500);
    }
    else {
      var re = /(?:^|\W)#(\w+)(?!\w)/g;
      if (this.standaredForm.postCaption) {
        while (this.match = re.exec(this.standaredForm.postCaption)) {
          this.matches.push(this.match[1]);
        }
        var hasTag = this.matches.toString()
      }
      else {
        var hasTag = null;
      }
      if (results.lat) {
        var latitude = results.lat;
      }
      else {
        var latitude = null;
      }
      if (results.lng) {
        var longitude = results.lng;
      }
      else {
        var longitude = null;
      }
      var data = {
        'isSponsoredPost': 0,
        'mainUrl':this.mainImgUrl,
        'thumbnailImageUrl': this.thumbUrl,
        'hashTags': hasTag,
        'postCaption': this.standaredForm.postCaption,
        'type': "0",
        'containerHeight': this.imgHeight,
        'containerWidth': this.imgWidth,
        'containerRatio': this.imgWidth / this.imgHeight,
        'hasAudio': 0,
      }
      if (this.userTagsArr.length > 0 && this.userTagsCoordsArr.length > 0) {
        data['usersTaggedInPosts'] = this.userTagsArr.toString();
        data['taggedUserCoordinates'] = JSON.stringify(this.userTagsCoordsArr);
      }
      if(jQuery('#pac-input1').val().trim()!=''){
            data['place']= jQuery('#pac-input1').val().split(',')[0];
            data['latitude']= latitude;
            data['longitude']= longitude;
      }
      this._postService.sponsoredPost(data)
        .subscribe((res) => {
          console.log(res);
          if (res.code == 200) {
            this.success = false;
            this.msg = "Post added successfully.";
            setTimeout(() => {
              this.success = true;
              this.msg = "";
              this._router.navigate([res.data.username + '/'+res.data.postId]);
            }, 1500);
          }
          else {
            this.error = false;
            this.msg = res.message;
            setTimeout(() => {
              this.error = true;
              this.msg = "";

            }, 1500);
          }
        });
    }

  }

  createSponsoredPost(results: any) {
    if (this.imageSrc == '') {
      this.error = false;
      this.msg = "Please Upload Image First";
      setTimeout(() => {
        this.error = true;
        this.msg = "";
      }, 1500);
    }
    else{
    this.matches = [];
    var re = /(?:^|\W)#(\w+)(?!\w)/g;
    if (this.sponsoredForm && this.sponsoredForm.postCaption) {
      while (this.match = re.exec(this.sponsoredForm.postCaption)) {
        this.matches.push(this.match[1]);
        var hasTag = this.matches.toString()
      }
    }
    else {
      var hasTag = null;
    }

    if (results.lat) {
      var latitude = results.lat;
    }
    else {
      var latitude = null;
    }
    if (results.lng) {
      var longitude = results.lng;
    }
    else {
      var longitude = null;
    }

    var data = {
      'isSponsoredPost': 1,
      'mainUrl':this.mainImgUrl,
      'thumbnailImageUrl': this.thumbUrl,
      'hashTags': hasTag,
      'postCaption': this.sponsoredForm.postCaption,
      'type': "0",
      'containerHeight': this.imgHeight,
      'containerWidth': this.imgWidth,
      'containerRatio': this.imgWidth / this.imgHeight,
      'hasAudio': 0,
      'sponProductTags': JSON.stringify(this.sponProductTagsArr),
      'sponProductCoordinates': JSON.stringify(this.sponProductCoordinatesArr)
    }
    if (this.userTagsArr.length > 0 && this.userTagsCoordsArr.length > 0) {
      for (var i = 0; i < this.userTagsArr.length; i++) {
        this.getSponUser.push(this.userTagsArr[i]);
        this.getSponUser = this.getSponUser.filter(function (elem: any, index: any, self: any) {
          return index == self.indexOf(elem);
        })
      }
      data['sponUsers'] = this.getSponUser.toString();
      data['usersTaggedInPosts'] = this.userTagsArr.toString();
      data['taggedUserCoordinates'] = JSON.stringify(this.userTagsCoordsArr);
    }
    else{
        this.getSponUser = this.getSponUser.filter(function (elem: any, index: any, self: any) {
          return index == self.indexOf(elem);
        })
      data['sponUsers'] = this.getSponUser.toString();
      data['usersTaggedInPosts'] = this.userTagsArr.toString();
      data['taggedUserCoordinates'] = JSON.stringify(this.userTagsCoordsArr);
    }
     if( jQuery('#pac-input2').val().trim()!=''){
            data['place']= jQuery('#pac-input2').val().split(',')[0];
            data['latitude']= latitude;
            data['longitude']= longitude;
      }
    this._postService.sponsoredPost(data)
      .subscribe((res) => {
        console.log("response of api")
        console.log(res);
        if (res.code == 200) {
          this.success = false;
          this.msg = "Post added successfully.";
          setTimeout(() => {
            this.success = true;
            this.msg = "";
            this._router.navigate([res.data.username + '/'+res.data.postId]);
          }, 1500);
        }
        else {
          this.error = false;
          this.msg = res.message;
          setTimeout(() => {
            this.error = true;
            this.msg = "";
          }, 1500);
        }
      });
    }
  }
  chkUrlValid(s:any){
      var regexpUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      console.log(regexpUrl.test(s));
      if(regexpUrl.test(s)){
         this.error_url=true;
      }
      else{
          this.error_url=false;
           setTimeout(() => {
          this.error_url=true;
           }, 2000);
       }
 }
  createProductPost(results: any) {
    
    if (this.imageSrc == '') {
      this.error = false;
      this.msg = "Please Upload Image First";
      setTimeout(() => {
        this.error = true;
        this.msg = "";
      }, 1500);
    }
    else if (this.productForm && !this.productForm.productName.trim()) {
      this.error = false;
      this.msg = "Product name is required";
      setTimeout(() => {
        this.error = true;
        this.msg = "";
      }, 1500);
    }
    else if (this.productForm && !this.productForm.price) {
      this.error = false;
      this.msg = "Product price is required";
      setTimeout(() => {
        this.error = true;
        this.msg = "";
      }, 1500);
    }
    
    else {
      this.matches = [];
      var re = /(?:^|\W)#(\w+)(?!\w)/g;
      if (this.productForm && this.productForm.postCaption) {
        while (this.match = re.exec(this.productForm.postCaption)) {
          this.matches.push(this.match[1]);
          var hasTag = this.matches.toString()
        }
      }
      else {
        var hasTag = null;
      }
      if (results.lat) {
        var latitude = results.lat;
      }
      else {
        var latitude = null;
      }
      if (results.lng) {
        var longitude = results.lng;
      }
      else {
        var longitude = null;
      }
     this.selectedCatArr = this.selectedCatArr.filter(function (elem: any, index: any, self: any) {
          return index == self.indexOf(elem);
        })
      var data = {
        'mainUrl':this.mainImgUrl,
        'thumbnailImageUrl': this.thumbUrl,
        'hashTags': hasTag,
        'postCaption': this.productForm.postCaption,
        'type': "0",
        'containerHeight': this.imgHeight,
        'containerWidth': this.imgWidth,
        'containerRatio': this.imgWidth / this.imgHeight,
        'hasAudio': 0,
        'price': this.productForm.price,
        'currency': '$',
        'productName': this.productForm.productName,
        'productUrl': this.productForm.productUrl,
        'category': this.selectedCatArr.toString(),
        'categoryTags': this.selectedCatArr.toString(),
        'buttonLabel': this.productForm.buttonLabel,
      }
     if (this.userTagsArr.length > 0 && this.userTagsCoordsArr.length > 0) {
        data['usersTaggedInPosts'] = this.userTagsArr.toString();
        data['taggedUserCoordinates'] = JSON.stringify(this.userTagsCoordsArr);
      }
      if( jQuery('#pac-input3').val().trim()!=''){
            data['place']= jQuery('#pac-input3').val().split(',')[0];
            data['latitude']= latitude;
            data['longitude']= longitude;
      }
      this._postService.productPost(data)
        .subscribe((res) => {
          console.log(res);
          if (res.code == 200) {
            this.success = false;
            var username = localStorage.getItem('username');
            this.msg = "Post added successfully.";
            setTimeout(() => {
              this.success = true;
              this.msg = "";
              this._router.navigate([username + '/shop/'+res.data[0].postId]);
            }, 1500);
          }
          else {
            this.error = false;
            this.msg = res.message;
            setTimeout(() => {
              this.error = true;
              this.msg = "";

            }, 1500);
          }
        });
    }
  }

  createPost(ev: any, type: any) {
    if (type == 1) {
      var address = jQuery('#pac-input1').val();
      if (address != '') {
        this._postService.getLatLong(address)
          .subscribe((res) => {
            this.createStandaredPost(res);
          });
      }
      else {
        this.createStandaredPost(ev);
      
      }
    }
    else if (type == 2) {
      var address = jQuery('#pac-input2').val();
      if (address != '') {
        this._postService.getLatLong(address)
          .subscribe((res) => {
            this.createSponsoredPost(res);
          });
      }
      else {
        this.createSponsoredPost(ev);
      
      }
    }
    else if (type == 3) {
      var address = jQuery('#pac-input3').val();
      if (address != '') {
        this._postService.getLatLong(address)
          .subscribe((res) => {
            this.createProductPost(res);
          });
      }
      else {
        this.createProductPost(ev);
      }
    }
  }

  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e: any) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  // handleImageLoad() {
  //     this.imageLoaded1 = true;
  //     this.iconColor = this.overlayColor;
  // }

  handleInputChange(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'luwfpdzx');
    this.uploaDing = true;
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
            console.log(this.percentComplete);
          }
        }, false);
          return xhr;
        },
        success: (res:any) => {
          console.log(res);
            this.imgWidth = res.width;
            this.imgHeight = res.height;
            var splitBefore=res.secure_url.split('/upload/')[1];
            var splitAfter=splitBefore.split('/')[1];
            this.thumbUrl=  "https://res.cloudinary.com/merriment/image/upload/w_300/"+splitAfter;
            this.mainImgUrl="https://res.cloudinary.com/merriment/image/upload/w_1080/"+splitAfter;
            this.imageSrc = this.mainImgUrl;
            this.loaded = true;
            this.hidden = true;
            this.isLoaded = false;
            this.imageLoaded = true;
            this.loaded1 = false;
        }
        });
  }

  // _handleReaderLoaded(e:any) {
  //     var reader = e.target;
  //     this.imageSrc1 = reader.result;
  //     this.loaded1 = true;
  // }

  _setActive() {
    this.borderColor = this.activeColor;
    if (this.imageSrc.length === 0) {
      this.iconColor = this.activeColor;
    }
  }

  _setInactive() {
    this.borderColor = this.baseColor;
    if (this.imageSrc.length === 0) {
      this.iconColor = this.baseColor;
    }
  }
   onClickOutside(event:Object) {
     console.log(event);
    if(event && event['value'] === true) {
      if(event['target'].classList[0]=='inside'){
      }
      else{
        this.taggingDoneFun();
      }

      if(event['target'].className=='color_thick member_name zero_padding' || event['target'].id=="catId" || event['target'].classList[3]=='aaa'){
       this.sugestionShow=true;
     }else{
         jQuery('.focused').removeClass('focused');
          this.sugestionShow=false;
      }

    } else {
    }
  }

  
  
}
