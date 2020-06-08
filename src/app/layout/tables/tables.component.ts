import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {UserService} from '../service/user.service';
import {User} from '../class/user';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    animations: [routerTransition()]
})
export class TablesComponent implements OnInit {

    listUsers: User[] = [];
    user: User;
    closeResult: string;

    userForm: FormGroup;

    get cin() {
        return this.userForm.get('cin');
    }

    get firstName() {
        return this.userForm.get('firstName');
    }

    get lastNom() {
        return this.userForm.get('lastNom');
    }

    get email() {
        return this.userForm.get('email');
    }

    get role() {
        return this.userForm.get('role');
    }

    get password() {
        return this.userForm.get('password');
    }


    constructor(private userService: UserService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    }

    getUserById(id: number, content) {
        this.userService.getUserById(id)
            .subscribe((user: User) => {
                this.user = user;
                this.setUser();
                this.open(content);
            });
    }


    setUser() {
        this.userForm.patchValue({
            cin: this.user.cin,
            firstName: this.user.firstName,
            lastNom: this.user.lastNom,
            email: this.user.email,
            role: this.user.role,
            password: this.user.password,
        });
    }

    ngOnInit() {
        this.userForm = this.formBuilder.group({
            cin: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
            firstName: ['', [Validators.required]],
            lastNom: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            role: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        this.userService.getAllUser()
            .subscribe((users: User[]) => {
                this.listUsers = users;
            });
    }


    addUser() {
        const user: User = new User();
        user.cin = this.cin.value;
        user.firstName = this.firstName.value;
        user.lastNom = this.lastNom.value;
        user.email = this.email.value;
        user.password = this.password.value;
        user.role = this.role.value;

        if (this.user) {
            user.id = this.user.id;
            this.userService.updateUser(user)
                .subscribe(() => {
                    this.userService.getAllUser()
                        .subscribe((users: User[]) => {
                            this.listUsers = users;
                        });
                });
        } else {

            this.userService.ajouterUser(user)
                .subscribe(() => {
                    this.userService.getAllUser()
                        .subscribe((users: User[]) => {
                            this.listUsers = users;
                        });
                });
        }

    }


    deleteUser(userId) {
        this.userService.deleteUser(userId)
            .subscribe(() => {
                this.userService.getAllUser()
                    .subscribe((users: User[]) => {
                        this.listUsers = users;
                    });
            });
    }


    // to open  the modal
    open(content) {
        this.modalService.open(content).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    // to close the model
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}
