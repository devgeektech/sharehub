import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import '/app/public/css/style.css';
//  import {HeaderComponent} from './header/header.component';
// import {FooterComponent} from './Theme/components/footer/footer.component';
// import {LoginComponent} from './AuthModule/login.component';
// import {HomeComponent} from './Home/home.component';
// import {PersonComponent} from './Home/person/person.component';
import { ROUTER_DIRECTIVES } from '@angular/router';
declare var ga:Function;
@Component({
  selector: 'my-app',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: './app.component.html',
  // template : `  
         
  //           <a class="mdl-navigation__link" [routerLink]="['/login']">Login</a>            
  //           <a class="mdl-navigation__link" [routerLink]="['/home']">Home</a>
          
  //   <!-- Router Outlet -->
    
  //   <router-outlet></router-outlet>      
  //   <footer><footer>`,
  // styleUrls: ['./app.component.css']
})
export class AppComponent { 
  private currentRoute:string;

    constructor(router:Router) {
        // Using Rx's built in `distinctUntilChanged ` feature to handle url change c/o @dloomb's answer
        router.events.distinctUntilChanged((previous: any, current: any) => {
            // Subscribe to any `NavigationEnd` events where the url has changed
            if(current instanceof NavigationEnd) {
                return previous.url === current.url;
            }
            return true;
        }).subscribe((x: any) => {
            ga('set', 'page', x.url);
            ga('send', 'pageview')
        });

        try { localStorage.setItem('','') } catch (e) {
            alert('You are in Private Browsing mode. We recommend switching to regular mode for a better user experience.');
        }
      }

      
    
}
