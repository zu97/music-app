import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { RegisterUserData, User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
  ) {}

  registerUser(userData: RegisterUserData) {
    const formData = new FormData();
    Object.keys(userData).forEach((data) => {
      formData.append(data, userData[data]);
    });

    return this.http.post<User>(env.apiUrl + '/users', formData);
  }

}
