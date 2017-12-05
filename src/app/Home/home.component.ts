import {Component} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../Theme/components/footer/footer.component';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: '/home.component.html',
    directives: [HeaderComponent, FooterComponent, ROUTER_DIRECTIVES]
})

export class HomeComponent {
    private sharePost=false;
    ngOnInit() {
        
        var token = localStorage.getItem('authToken');
            if(token){
                   this.sharePost = true; 
            }
    }

}