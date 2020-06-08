import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../class/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {
    }


    getAllUser(): Observable<User[]> {
        return this.http.get<User[]>('http://localhost:8080/users/getAllUsers');
    }


    ajouterUser(user: User): Observable<User> {
        return this.http.post<User>('http://localhost:8080/users/createUser', user);
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>('http://localhost:8080/users/getUserById/' + id);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>('http://localhost:8080/users/updateUser', user);
    }

    deleteUser(idUser: number): Observable<any> {
        return this.http.delete('http://localhost:8080/users/deleteUser/' + idUser);
    }

}
