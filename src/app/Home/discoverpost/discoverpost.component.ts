import {Component} from '@angular/core';
import {DiscoverpostService} from '../discoverpost/discoverpost.service';
import { Router } from '@angular/router';
import {HeaderComponent} from '../../header/header.component';
import { InfiniteScroll } from 'angular2-infinite-scroll';
@Component({
    selector: 'discover',
    templateUrl: '/discoverpost.component.html',
    providers: [DiscoverpostService],
    directives: [HeaderComponent,InfiniteScroll]
})

export class DiscoverpostComponent {

    private loading = true;
    private data: any;
    private offset = 0;
    private loadmoree:any;
    // private buffer = false;
    constructor(private _discoverService: DiscoverpostService, private _router: Router) {

    }

    ngOnInit() {
        var token = localStorage.getItem('authToken');
        if (!token)
            this._router.navigate(["login"]);

        this._discoverService.discoverpeople()
            .subscribe((res) => {
                this.data = res.discoverData;
                this.offset = this.data.length;
                this.loading = false;
                if (this.offset >= 20)
                    this.loadmoree = true;
            });
    }

    loadmore() {
        this.offset = this.data.length;
        console.log(this.offset);
        this._discoverService.loadmore(this.offset)
            .subscribe((res) => {
                var len = res.discoverData.length;
                 for (var i = 0; i < len; i++) {
                    this.data.push(res.discoverData[i]);
                    }                
                this.offset = res.discoverData.length || 0;
                if (this.offset >= 20)
                    this.loadmoree = true;
                else
                    this.loadmoree = false;
            });
    }

    memberprofile(username: any): void {
        // alert(item.postsId);
        var personname = username.toLowerCase();
       var currentusername = localStorage.getItem('username');
       if(currentusername == personname){
            this._router.navigate(['profile']);
            }
            else{
                let link = ['', personname];
                this._router.navigate(link);
            }        
        // let link = ['', username.toLowerCase()];
        // this._router.navigate(link);
    }

    following(username: any, i: number) {
        // alert(i+'ll'+username+'ff'+followFlag);
        //  this.buffer = true;
         var privateProfile = this.data[i].privateProfile;
        // console.log(privateProfile);
        if(privateProfile == 1){
            this.data[i].loaderFlag = true;      
            setTimeout(() => {        
                this.data[i].followsFlag = 2;
            }, 500);       
            this._discoverService.following(username)
                .subscribe();       
            setTimeout(() => {
                this.data[i].loaderFlag = false;
            }, 500);    

        }else{
            this.data[i].loaderFlag = true;      
            setTimeout(() => {        
                this.data[i].followsFlag = 1;
            }, 500);       
            this._discoverService.following(username)
                .subscribe();       
            setTimeout(() => {
                this.data[i].loaderFlag = false;
            }, 500); 
        }         
    }

    follow(username: any, i: number) {        
        this.data[i].loaderFlag = true; 
        setTimeout(() => {     
         this.data[i].followsFlag = 0;
         }, 500);          
        this._discoverService.follow(username)
            .subscribe();
        setTimeout(() => {
            this.data[i].loaderFlag = false;
        }, 500);      
       
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