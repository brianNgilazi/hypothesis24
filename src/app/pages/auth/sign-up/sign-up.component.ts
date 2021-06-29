import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {


  form: FormGroup = null;
  signUpError: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.form = new FormGroup({
      username: new FormControl('', [Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, this.MustMatch('password', 'confirmPassword'));
  }

  signUp(formValue){
    this.authService.signUp(formValue).then(() => this.router.navigate(['profile']), error => {
      return this.signUpError = error;
    })
    .catch(error => this.signUpError = error);
  }

   // custom validator to check that two fields match
   /**
    * Custom validator to check that valus of two controls match
    * @param primaryControlName The name of the main control
    * @param matchingControlName The name of the second control whose value is to be
    * checked against sthat of the first control
    * @returns A validator function
    */
   MustMatch(primaryControlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[primaryControlName];
        const matchingControl = formGroup.controls[matchingControlName];

        // return null if controls haven't been initialised yet
        if (!control || !matchingControl) {
          return null;
        }

        // return null if another validator has already found an error on the matchingControl
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return null;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
      };
  }


}
