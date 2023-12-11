import { Component, OnInit, Inject, Output, EventEmitter, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';

import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { UserAuthService } from 'src/app/user-auth.service';
import { AuditlogService } from 'src/app/shared/auditlog.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'custom-validators';


@Component({
    selector: 'app-update-password',
    templateUrl: './update-password.component.html',
    styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

    // public loginForm: FormGroup;
    submitted = false;

    hidePassword1: boolean = true;

    hidePassword2: boolean = true;

    updatePasswordForm: FormGroup;

    buttonClicked = false;

    password: string = '';
    confirm_password: string = '';
    constructor(
        private formBuilder: FormBuilder,
        private userService: UserAuthService,
        private auditlogService: AuditlogService,
        public dialog: MatDialog,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<UpdatePasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        // this.email = (localStorage.getItem('email') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('email') || '{}')) : '';

        this.updatePasswordForm = this.formBuilder.group({
            newPassword: [
                null,
                Validators.compose([
                    Validators.required,
                    CustomValidators.patternValidator(/\d/, { hasNumber: true }),
                    CustomValidators.patternValidator(/[A-Z]/, {
                        hasCapitalCase: true,
                    }),
                    CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
                    // check whether the entered password has a special character
                    // CustomValidators.patternValidator(
                    //   /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
                    //   {
                    //     hasSpecialCharacters: true
                    //   }
                    // ),

                    Validators.minLength(8),
                ]),
            ],
            confirmPassword: ['', Validators.required],
            email: [(localStorage.getItem('email') || '{}') ? this.auditlogService.decryptAES((localStorage.getItem('email') || '{}')) : ''],
        }, { validator: this.passwordMatchValidator });

        // this.loginForm = this.createSignupForm();
    }

    createSignupForm(): FormGroup {
        return this.formBuilder.group(
            {

                password: [
                    null,
                    Validators.compose([
                        Validators.required,
                        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
                        CustomValidators.patternValidator(/[A-Z]/, {
                            hasCapitalCase: true,
                        }),
                        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
                        // check whether the entered password has a special character
                        // CustomValidators.patternValidator(
                        //   /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
                        //   {
                        //     hasSpecialCharacters: true
                        //   }
                        // ),

                        Validators.minLength(8),
                    ]),
                ],
                //confirmPassword: [null, Validators.compose([Validators.required])]
            }
            // {
            //   // check whether our password and confirm password match
            //   validator: CustomValidators.passwordMatchValidator
            // }
        );
    }

    ngOnInit(): void {
        // this.updatePasswordForm = this.formBuilder.group({
        //     newPassword: ['', [Validators.required, Validators.minLength(6)]],
        //     confirmPassword: ['', Validators.required],
        //     email: ['sally.smith@example.com'],
        // }, { validator: this.passwordMatchValidator });
    }

    togglePassword1Visibility() {
        this.hidePassword1 = !this.hidePassword1;
    }

    togglePassword2Visibility() {
        this.hidePassword2 = !this.hidePassword2;
    }


    passwordMatchValidator(group: FormGroup | null): { [key: string]: boolean } | null {
        if (!group) {
            return null;
        }

        const newPasswordControl = group.get('newPassword');
        const confirmPasswordControl = group.get('confirmPassword');

        if (!newPasswordControl || !confirmPasswordControl) {
            return null;
        }

        const newPassword = newPasswordControl.value;
        const confirmPassword = confirmPasswordControl.value;

        return newPassword === confirmPassword ? null : { mismatch: true };
    }

    updatePassword() {
        this.buttonClicked = true;
        this.submitted = true;
        if (this.updatePasswordForm.valid) {
            // Perform the update logic
            this.updateNewPassword(this.updatePasswordForm)
            this.onClose()
        }
    }

    // updateNewPassword(group: FormGroup | null): { [key: string]: boolean } | null {

    //     if (!group) {
    //         return null;
    //     }

    //     const newPasswordControl = group.get('newPassword');
    //     const confirmPasswordControl = group.get('confirmPassword');

    //     console.log("newPasswordControl", newPasswordControl?.value)
    //     console.log("confirmPasswordControl", confirmPasswordControl?.value)

    //     let newPasswordObj = {
    //         'userId':2,
    //         'password': newPasswordControl,
    //     }

    //     this.userService.updatePassword(newPasswordObj).subscribe((response) => {
    //         console.log("update Password Response", response)
    //      }



    //     return null

    // }

    updateNewPassword(group: FormGroup | null): { [key: string]: boolean } | null {
        if (!group) {
            return null;
        }

        const newPasswordControl = group.get('newPassword');
        const confirmPasswordControl = group.get('confirmPassword');

        console.log("newPasswordControl", newPasswordControl?.value);
        console.log("confirmPasswordControl", confirmPasswordControl?.value);

        // Check if passwords match
        if (newPasswordControl?.value !== confirmPasswordControl?.value) {
            return { 'passwordMismatch': true };
        }

        // Create an object with user ID and password
        const newPasswordObj = {
            'userId': Number(localStorage.getItem('userId')),
            'password': newPasswordControl?.value,
        };

        // Call the updatePassword method in UserService
        this.userService.updatePassword(newPasswordObj).subscribe(
            (response) => {
                console.log("Update Password Response", response);
                if (response.Success) {
                    this.toastr.success(response.Message);

                }
                // You can handle the response here if needed
            },
            (error) => {
                console.error("Update Password Error", error);
                // Handle errors appropriately
            }
        );

        return null;
    }




    onClose(): void {
        // Close the dialog, return false

        this.dialogRef.close(false);
    }
}