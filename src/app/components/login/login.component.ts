import { Component, OnInit } from '@angular/core';
import {IntegrationService} from "../../services/integration.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginRequest} from "../../models/login-request";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private integrationService: IntegrationService,private userService: UserService ,private router: Router) { }

  userForm : FormGroup= new FormGroup({
    identifiant: new FormControl(''),
    password: new FormControl('')
  })
  request: LoginRequest = new LoginRequest;

  login() {
    const formValue = this.userForm.value;

    if (formValue.identifiant == '' || formValue.password == '') {
      alert('Identifiant or password cannot be empty');
      return;
    }

    this.request.identifiant = formValue.identifiant;
    this.request.password = formValue.password;

    this.integrationService.doLogin(this.request).subscribe({
      next:(res) => {
        console.log("Received Response:"+res.token);
        localStorage.setItem('Token', res.token);
        this.fetchUserDetails();
        this.router.navigate(['/user-profile']);
      }, error: (err) => {
        console.log("Error Received Response:"+err);
      }
    });
  }

  fetchUserDetails() {
    const token = localStorage.getItem('Token');

    if (token) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          if (userDetails.role && userDetails.classe) {
            localStorage.setItem('userRole', userDetails.role);
            localStorage.setItem('userClasse', userDetails.classe);
          }
        },
        error: (err) => {
          console.log('Error fetching user details:', err);
        }
      });
    }
  }
  ngOnInit(): void {
  }

}
