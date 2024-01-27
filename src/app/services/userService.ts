
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { IUserFeedback } from './IUserFeedback';

@Injectable({
    providedIn: 'root',
})

export class userService{ //сервис для работы с пользователями
    constructor(private http: HttpClient) {}

    register(name : string, email : string, password : string) : Observable<IUserFeedback>{ //функция возвращает Observable<IUserFeedback> для получения токена/ошибки
        return this.http.post<IUserFeedback>('https://95f407c957ff95e8.mokky.dev/register', {fullname: name, email : email, password : password}) //пользователь прокидывается в /register
    }

    login(email : string, password : string) : Observable<IUserFeedback>{ //все то же самое только endpoint /auth
        return this.http.post<IUserFeedback>('https://95f407c957ff95e8.mokky.dev/auth', {email : email, password : password})
    }
}