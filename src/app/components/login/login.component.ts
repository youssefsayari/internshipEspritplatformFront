import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { IntegrationService } from "../../Services/integration.service";
import { UserService } from "../../Services/user.service";
import { LoginRequest } from "../../models/login-request";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  userForm: FormGroup = new FormGroup({
    identifiant: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  request: LoginRequest = new LoginRequest();

  constructor(private integrationService: IntegrationService, private userService: UserService, private router: Router) { }

  ngOnInit(): void { }

  async login() {
    const formValue = this.userForm.value;

    if (!formValue.identifiant || !formValue.password) {
      Swal.fire({
        title: '⚠️ Error',
        text: 'Identifiant or password cannot be empty!',
        icon: 'error',
        width: '50%',
        customClass: {
          popup: 'swal-custom-popup',
          confirmButton: 'swal-custom-button'
        }
      });
      return;
    }

    this.request.identifiant = formValue.identifiant;
    this.request.password = formValue.password;


    try {
      const res = await this.integrationService.doLogin(this.request).toPromise();
      localStorage.setItem('Token', res.token);
      this.fetchUserDetails();

      setTimeout(() => {
        const userRole = localStorage.getItem('userRole');
        this.router.navigate([userRole === 'Admin' ? '/dashboard' : '/user-profile']);
      }, 500);
    } catch (err) {
      Swal.fire({
        title: '❌ Login Failed',
        text: 'Invalid credentials. Please try again.',
        icon: 'error',
        width: '50%',
        customClass: {
          popup: 'swal-custom-popup',
          confirmButton: 'swal-custom-button'
        }
      });
    }
  }

  fetchUserDetails() {
    const token = localStorage.getItem('Token');
    if (!token) return;

    this.userService.decodeTokenRole(token).subscribe({
      next: (userDetails) => {
        localStorage.setItem('userRole', userDetails.role);
        localStorage.setItem('userClasse', userDetails.classe);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: '⚠️ Error',
          text: 'Failed to fetch user details. Please log in again.',
          width: '50%',
          customClass: {
            popup: 'swal-custom-popup',
            confirmButton: 'swal-custom-button'
          }
        });
      }
    });
  }

  async forgotPassword() {
    const { value: email } = await Swal.fire({
      title: '📧 Forgot Password',
      input: 'email',
      inputPlaceholder: 'Enter your email address',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Send OTP',
      width: '50%',
      showLoaderOnConfirm: true,
      customClass: {
        popup: 'swal-custom-popup',
        confirmButton: 'swal-custom-button',
        input: 'swal-custom-input'
      },
      preConfirm: async (email) => {
        if (!email) {
          Swal.showValidationMessage('⚠️ Please enter a valid email address');
          return false;
        }

        try {
          const response = await this.userService.sendOtp(email).toPromise();
          return email;
        } catch (error) {
          Swal.showValidationMessage('❌ Failed to send OTP. Try again.');
          return false;
        }
      }
    });

    if (email) await this.requestOtp(email);
  }

  async requestOtp(email: string) {
    const { value: otp } = await Swal.fire({
      title: '🔑 Enter OTP',
      input: 'text',
      inputPlaceholder: 'Enter the OTP sent to your email',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Verify OTP',
      width: '50%',
      showLoaderOnConfirm: true,
      customClass: {
        popup: 'swal-custom-popup',
        confirmButton: 'swal-custom-button',
        input: 'swal-custom-input'
      },
      preConfirm: async (otp) => {
        if (!otp) {
          Swal.showValidationMessage('⚠️ Please enter the OTP');
          return false;
        }

        try {
          console.log(`Verifying OTP: ${otp} for email: ${email}`);
          const response = await this.userService.verifyOtp(email, +otp).toPromise();

          if (response === true) { // ✅ Ensure response is true before proceeding
            return email;
          } else {
            Swal.showValidationMessage('❌ Invalid OTP. Try again.');
            return false;
          }
        } catch (error) {
          console.error('Error verifying OTP:', error);
          Swal.showValidationMessage('⚠️ Invalid OTP. Try again.');
          return false;
        }
      }
    });

    if (otp) {
      await this.changePassword(email);
    }
  }

  async changePassword(email: string) {
    const { value: newPassword } = await Swal.fire({
      title: '🔒 Change Password',
      input: 'password',
      inputPlaceholder: 'Enter your new password',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Change Password',
      width: '50%',
      showLoaderOnConfirm: true,
      customClass: {
        popup: 'swal-custom-popup',
        confirmButton: 'swal-custom-button',
        input: 'swal-custom-input'
      },
      preConfirm: async (newPassword) => {
        if (!newPassword) {
          Swal.showValidationMessage('⚠️ Please enter a new password');
          return false;
        }

        try {
          await this.userService.changePassword(email, newPassword).toPromise();
          Swal.fire({
            title: '✅ Success',
            text: 'Your password has been changed!',
            icon: 'success',
            width: '50%',
            customClass: {
              popup: 'swal-custom-popup',
              confirmButton: 'swal-custom-button'
            }
          });
        } catch (error) {
          Swal.showValidationMessage('❌ Error changing password. Try again.');
          return false;
        }
      }
    });
  }
  redirectToAddCompany() {
    this.router.navigate(['/add-company']); // Rediriger vers la route add-company
  }
}
