import {Component} from '@angular/core';
import '../../../public/css/style.css';
// import {FooterComponent} from './footer.component';
import {FooterComponent} from '../Theme/components/footer/footer.component';
import { Router } from '@angular/router';
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlMessages } from './login-message.component';
import { ValidationService } from './login-validation.service';
import {AuthService} from '../sharedServices/AuthService/auth.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {Location} from '@angular/common';

declare const FB: any;
declare const jQuery: any;
declare const grecaptcha: any;
// declare const resp: any;
// declare const resposne: any;

@Component({
    selector: 'login',
    // directives: [FooterComponent],
    directives: [FooterComponent, REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES, ControlMessages],
    providers: [AuthService],
    // template: '<h1>My First Angular 2 App</h1>',
    templateUrl: './login.html'
})


export class LoginComponent {

    private username: String;
    private fullName: String;
    private referer: String;
    private password: String;
    private signUpType: Number;
    private email: String;
    private deviceType: Number;
    private pushToken: String;
    private deviceId: String;
    private profilePicUrl: String;
    private widgetId1: any;
    private data_key = '6Le98SkUAAAAAFWXt_kqA6z1t3sU5fMFTpI02zBR'
    private login_valid: boolean = true;
    private wrong_attemt = 0;
   private bufferlogin=false;
   private buffer_login=false;
    signupForm: any;
    loginForm: any;
    resetForm: any;
    private loginMessage: any;
    private loginSuccess: any;
    private signupMessage:any;
    private signupSuccess: any;
    private resetSuccess: any;
    private reseterror: any;
    private token: any;
    private loged: boolean = false;
    private user: any;
    private fbloginerror:any;
    fbloginerror1:any;
    private error_icon=false;

    constructor(private _authService: AuthService, private formBuilder: FormBuilder, private _router: Router,private _location:Location) {

        FB.init({
            appId: '152854238613410',
            cookie: false,  // enable cookies to allow the server to access 
            xfbml: true,  // parse social plugins on this page 
            version: 'v2.10' // use graph api version 2.5 
        });

        

        this.signupForm = this.formBuilder.group({
            'username': ['', Validators.required],
            'fullName': ['', Validators.required],      
            'email': ['', [Validators.required, ValidationService.emailValidator]],
            'password': ['', [Validators.required]],
             'referer': ['']
        });

        this.loginForm = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', [Validators.required]]
        });

        this.resetForm = this.formBuilder.group({
            'email': ['', [Validators.required, ValidationService.emailValidator]],
        });
    }
    private hideElement = false;
    private displayLogin = false;
    private edited = false;
    returnUrl:string;

    ngOnInit() {
         jQuery(".modal-backdrop").css({ "display": "none" });
        this.returnUrl = this._location.path();
        if(this.returnUrl.indexOf('/login?returnUrl=')>=0){
          this.returnUrl= this.returnUrl.split('/login?returnUrl=')[1];
        }
        else{
            this.returnUrl='';
        }
        console.log(this.returnUrl);
        var token = localStorage.getItem('authToken');
        if (token)
            this._router.navigate([this.returnUrl], {queryParams: {}});
    }

    login() {
        this.displayLogin = true;
        this.hideElement = false;
        this.edited = false;
    }

    authenticateUser() {
       
        this.bufferlogin = true;
        this._authService.login({ username: this.username, password: this.password })
            .subscribe((res) => {
                if (res.code == 200) {                     
                     setTimeout(() => {
                        this.bufferlogin = false;
                    }, 500);
                    // this.loginSuccess = res.message; 
                     setTimeout(() => {
                         if(localStorage.getItem('isOwner')){
                             this.returnUrl= '/' + localStorage.getItem('isOwner')+'?ref=' +this.returnUrl.split('?ref=')[1];
                             localStorage.removeItem('isOwner')
                             this._router.navigate([this.returnUrl], {queryParams: {}});
                         }
                         else{
                           this._router.navigate([this.returnUrl], {queryParams: {}});
                         }
                    }, 500);                   
                    

                    //  alert(res.message);            
                }
                if (res.code == 1971) {
                    setTimeout(() => {
                        this.bufferlogin = false;
                    }, 500);
                     setTimeout(() => {                   
                    this.loginMessage = res.errMessage1;
                    }, 500);                    
                }
                if (res.code == 1972) {
                    setTimeout(() => {
                        this.bufferlogin = false;
                    }, 500);
                     setTimeout(() => {
                    this.loginMessage = res.errMessage2;
                    }, 500);
                }
                if (res.code == 1973) {
                    setTimeout(() => {
                        this.bufferlogin = false;
                    }, 500);
                     setTimeout(() => {
                    this.loginMessage = res.message;
                    }, 500);
                }
                if (res.code == 1974) {
                    setTimeout(() => {
                        this.bufferlogin = false;
                    }, 500);
                     setTimeout(() => {
                    this.loginMessage = res.message;
                    }, 500);
                    //    alert(res.message);       
                }
                if(res.code != 200) {
                    this.wrong_attemt += 1;
                    if(this.wrong_attemt ==3) {
                        jQuery("#example1").html('');
                        this.login_valid = false;
                        this.widgetId1 = grecaptcha.render('example1', {
                            'sitekey' : this.data_key,
                            'callback' : this.verifyCallback,
                            'theme' : 'light'
                        });
                    } else if(this.wrong_attemt > 3) {
                        jQuery("#example1").html('');
                        this.login_valid = false;
                        grecaptcha.reset(this.widgetId1);
                        this.widgetId1 = grecaptcha.render('example1', {
                            'sitekey' : this.data_key,
                            'callback' : this.verifyCallback,
                            'theme' : 'light'
                        });
                    }
                }
            });
    }

    register() {
        this.displayLogin = false;
        this.hideElement = false;
        this.edited = false;
    }

    forgot() {
        this.hideElement = true;
        this.edited = true;
    }

   
    // private right_icon=false;
    registerUser() {
        var emailcheck = jQuery(".sign_validation").val();
        // var fullName = jQuery(".fullname").val();
        var username = jQuery(".sign_validation1").val();
        var fullname_register = jQuery('.fullname_register').val();
        var password_signup = jQuery('.sign_validation2').val();
        if(fullname_register){
            jQuery(".fullname_register").siblings().removeClass("error");
			jQuery(".fullname_register").siblings().addClass("right");	 
        }
         if(password_signup){
            jQuery(".sign_validation2").siblings().removeClass("error");
			jQuery(".sign_validation2").siblings().addClass("right");	 
        }

        if(username){
            this._authService.signupusernamecheck({            
            username: username,           
        })
            .subscribe((res) => {
                                if (res.code == 1994) {
                    // this.error_icon = false;
                    jQuery(".sign_validation1").siblings().removeClass("right");
                    jQuery(".sign_validation1").siblings().addClass("error");
                    jQuery(".error_show").hide();                   
                    }
               
                if (res.code == 200) {
                    this.error_icon = false;
                    jQuery(".sign_validation1").siblings().removeClass("error");
                    jQuery(".sign_validation1").siblings().addClass("right"); 
                     jQuery(".error_show").hide();          
                    }
                });
    }
        
      
        this._authService.signupemailcheck({           
            email: emailcheck,
           
        })
            .subscribe((res) => {

                if (res.code == 1988) {
                    // this.error_icon = false;
                    jQuery(".sign_validation").siblings().removeClass("right");
                    jQuery(".sign_validation").siblings().addClass("error");                  
                     jQuery(".error_show").hide();          
                    }               
                if (res.code == 200) {
                    this.error_icon = false;
                    jQuery(".sign_validation").siblings().removeClass("error");
                    jQuery(".sign_validation").siblings().addClass("right"); 
                     jQuery(".error_show").hide();          
                    }
                });
        
    }

    registerUsersubmit() {
        // var email = jQuery(".sign_validation").val();
        // var fullName = jQuery(".fullname").val();
        // var username = jQuery(".sign_validation1").val();
        // var password = jQuery(".sign_validation1").val();
        // this.email = email;
        // this.fullName = fullName;
        // this.username = username;
        // this.password = password;
        
        function ValidateEmail(email:any) {
            var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            return expr.test(email);
        }
        if (!ValidateEmail(jQuery(".sign_validation").val())) {
            //alert("Invalid email address.");
			jQuery(".sign_validation").siblings().removeClass("right"); 
			jQuery(".sign_validation").siblings().addClass("error");
			jQuery(".error_show").show();
			jQuery(".error_email").show();
        }
        else {
            //alert("Valid email address.");
			jQuery(".sign_validation").siblings().removeClass("error");
			jQuery(".sign_validation").siblings().addClass("right");
			jQuery(".error_show").hide();
			jQuery(".error_email").hide();
        }		
		if(jQuery('.sign_validation1').val() != ''){
			jQuery(".sign_validation1").siblings().removeClass("error");
			jQuery(".sign_validation1").siblings().addClass("right");
			jQuery(".error_show").hide();	
		 }else{
			jQuery(".sign_validation1").siblings().removeClass("right"); 
			jQuery(".sign_validation1").siblings().addClass("error"); 
			jQuery(".error_show").show();	
		 }
		 if(jQuery('.sign_validation2').val() != ''){
			jQuery(".sign_validation2").siblings().removeClass("error");
			jQuery(".sign_validation2").siblings().addClass("right");
			jQuery(".error_show").hide();	
		 }else{
			jQuery(".sign_validation2").siblings().removeClass("right"); 
			jQuery(".sign_validation2").siblings().addClass("error"); 
			jQuery(".error_show").show();	
		 }

    if(ValidateEmail(jQuery(".sign_validation").val()) && jQuery('.sign_validation1').val() && jQuery('.sign_validation2').val()){
        
        this.bufferlogin = true;
        console.log( this.referer);
        this._authService.register({
            signUpType: 2,           //Signup via email
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            deviceType: 3,
            pushToken: 'browser',
            profilePicUrl: null,
            password: this.password,
            deviceId: 'browser',
            referer: this.referer,
        })
            .subscribe((res) => {
                if (res.code == 2004) {
                    jQuery(".sign_validation").siblings().removeClass("right");
                    jQuery(".sign_validation1").siblings().removeClass("right");
                    this.error_icon = true;
                     setTimeout(() => {
                        this.bufferlogin = false;
                    }, 500);
                     setTimeout(() => {
                        this.signupMessage = res.message;
                     }, 500);
                }

                if (res.code == 200) {
                    setTimeout(() => {
                        this.bufferlogin = false;
                    }, 500);
                    // this.signupSuccess = res.message;     
                     setTimeout(() => {
                         if(localStorage.getItem('isOwner')){
                              this.returnUrl= '/' + localStorage.getItem('isOwner')+'?ref=' +this.returnUrl.split('?ref=')[1];
                             localStorage.removeItem('isOwner')
                             this._router.navigate([this.returnUrl], {queryParams: {}});
                         }
                         else{
                           this._router.navigate([this.returnUrl], {queryParams: {}});
                         }
                       
                    }, 500);                             
                   
                }
            });
         }
    }
    
    forgotPassword() {
        
        this.bufferlogin = true;
        this._authService.resetPassword({
            email: this.email,
            type : '0'
        }).subscribe((res) => {
            if (res.code == 200) {
                setTimeout(() => {
                    this.bufferlogin = false;
                }, 500);
                this.resetSuccess = res.message;
                setTimeout(() => {
                    this.resetSuccess  = " ";
                    jQuery("#forgotemail").val(" ");                   
                    this.displayLogin = false;
                    this.hideElement = false;
                    this.edited = false;                 
                }, 2000);                             
            }
            if (res.code == 1976) {
                 setTimeout(() => {
                    this.bufferlogin = false;
                }, 500);
                this.reseterror = res.message;
                setTimeout(() => {
                    this.reseterror  = " ";
                    jQuery("#forgotemail").val(" ");                   
                    this.displayLogin = false;
                    this.hideElement = false;
                    this.edited = false;                 
                }, 2000);    
            }
        });
    }

    
    onFacebookLoginClick(): void {
        this.buffer_login = true;
        FB.getLoginStatus((response: any) => {
            this.statusChangeCallback(response);
        })

    }
    statusChangeCallback(response: any) {
        if (response.status === 'connected')
            this.me();
        else            
             this.fblogin();
    }

    fblogin() {
        FB.login((result: any) => {
            this.loged = true;
            this.token = result;
            this.me();
        }, {
            scope: 'public_profile,email,user_birthday',
            auth_type: 'rerequest'
        });
    }

    me() {
        FB.api('/me',{ locale: 'en_US', fields: 'id, name, email, first_name, last_name, gender, birthday' },
            (result: any) => {               
                this.user = result;
                this.buffer_login = true;              
                console.log(result);                         
                this._authService.registerfacebooklogin(this.user, this.referer)
                    .subscribe((res) => {
                    if (res.code == 2005) {  
                         jQuery(".loaderFb").hide();                             
                         this.fb_login();
                        }else if(res.code == 200){
                             jQuery(".loaderFb").hide();    
                        if(localStorage.getItem('isOwner')){
                             this.returnUrl= '/' + localStorage.getItem('isOwner')+'?ref=' +this.returnUrl.split('?ref=')[1];
                             localStorage.removeItem('isOwner')
                             this._router.navigate([this.returnUrl], {queryParams: {}});
                         }
                         else{
                           this._router.navigate([this.returnUrl], {queryParams: {}});
                         }
                         }            
                    if (res.code == 197) {
                         jQuery(".loaderFb").hide();                                                  
                        this.fbloginerror = res.message;
                    }                    
                });                
            });
            }
    
    fb_login(){
        FB.api('/me',{ locale: 'en_US', fields: 'id, name, email, first_name, last_name, gender, birthday' },
            (result: any) => {                
                this.user = result;                              
                this._authService.facebooklogin(this.user)
                    .subscribe((res) => {                                            
                    if (res.code == 200) {
                         if(localStorage.getItem('isOwner')){
                              this.returnUrl= '/' + localStorage.getItem('isOwner')+'?ref=' +this.returnUrl.split('?ref=')[1];
                             localStorage.removeItem('isOwner')
                             this._router.navigate([this.returnUrl], {queryParams: {}});
                         }
                         else{
                           this._router.navigate([this.returnUrl], {queryParams: {}});
                         }                     
                    }
                    if (res.code == 197) { 
                        jQuery(".fberror").show();                                            
                        // this.fbloginerror1 = res.message;
                    }
                });                  
            });
    }

    signupUser() {
        if (this.signupForm.dirty && this.signupForm.valid) {
            // alert("hi");
            // window.location.href="http://localhost:8080/";
            //  alert(`Username: ${this.signupForm.value.username} Email: ${this.signupForm.value.email}`);
        }
    }

    loginUser() {
        if (this.loginForm.dirty && this.loginForm.valid) {
            // alert(`Username: ${this.loginForm.value.username} Password: ${this.loginForm.value.password}`);
        }
    }
    verifyCallback = (response:any) => {
        if(response) {
            this.login_valid = true;
        }
    };


}