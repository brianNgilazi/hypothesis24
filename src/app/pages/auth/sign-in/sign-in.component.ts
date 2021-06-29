import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  form: FormGroup = null;
  signInError: string;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.form = this.fb.group({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  signIn(formValue){
    this.authService.signIn(formValue).then(() => this.router.navigate(['profile']), error => this.signInError = error)
    .catch(error => this.signInError = error);
  }

}
