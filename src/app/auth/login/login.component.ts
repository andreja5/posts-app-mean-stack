import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

  
@Component({
  selector: 'login-app',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading =  false;
      }
    )
  }

  constructor(private authService: AuthService) {}

  onLogin(form: NgForm) {
    this.authService.loginUser(form.value.email, form.value.password);
    this.isLoading = true;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}