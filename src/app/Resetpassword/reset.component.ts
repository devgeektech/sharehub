import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FooterComponent} from '../Theme/components/footer/footer.component';
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlMessages } from '../AuthModule/login-message.component';
import { ValidationService } from '../AuthModule/login-validation.service';
import {AuthService} from '../sharedServices/AuthService/auth.service';


@Component({
    selector: 'reset',    
    templateUrl: '/reset.component.html', 
    directives: [FooterComponent, REACTIVE_FORM_DIRECTIVES, ControlMessages],
    providers: [AuthService]
})

export class ResetpasswordComponent{
    retypepasswordForm : any;
    private newPassword : any;
    private confirmPassword : any;

    private resetpassSuccess = false;
    private resetpasserror:any;
    private reset_token : any;
    private bufferlogin=false;

constructor(private formBuilder: FormBuilder, private _authService: AuthService, private _router: Router, private route: ActivatedRoute) {

     this.retypepasswordForm = this.formBuilder.group({
           'newPassword': ['', [Validators.required]],
           'confirmPassword': ['', [Validators.required]]
        });

}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.reset_token = params['reset_token'];
            console.log(this.reset_token); 
            });
        }

    changePassword() {
        this.bufferlogin = true;
        this._authService.changePassword({
            password: this.newPassword,
            repeatPassword : this.confirmPassword,
            passwordResetLink:this.reset_token
        }).subscribe((res) => {         
          if (res.code == 200) {
            //   alert(res.message);
             setTimeout(() => {
                this.bufferlogin = false;
            }, 500);
             this.resetpasserror = false;            
             this.resetpassSuccess = true; 
             setTimeout(() => {
                 this._router.navigate(['login']); 
             }, 1500);             
          }
          if (res.code == 1981) {
            setTimeout(() => {
                this.bufferlogin = false;
            }, 500);                       
           this.resetpasserror = res.message;
        //    this._router.navigate(['home']);                     
          }
        if (res.code == 1983) {
            setTimeout(() => {
                this.bufferlogin = false;
            }, 500);                       
           this.resetpasserror ="password reset link invalid";
        //    this._router.navigate(['home']);                     
          }
        });
    }




}