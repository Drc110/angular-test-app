import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { userService } from '../../services/userService'
import { FormsModule } from '@angular/forms';
import { IUserFeedback } from '../../services/IUserFeedback';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})

export class UserComponent { //компонент формы входа/реистрации
  register = false; //флаг для отображения регистрации
  
  fullname : string = ''; //3 поля для заполнения 
  email: string = '';
  password: string = '';

  emailRegExp : RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/; //слово + @ + слово + . + слово
  passwordRegExp : RegExp = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{3,}$/ //латиница заглавная/малая + 0-9 от 3-х символов
  emailCheck = true //флаги для ngClass (валидация пароля и почты)
  passwordCheck = true

  toggle(){
    this.register = !this.register //смена флага
  }

  constructor(private service : userService, private router: Router) {}

  registerBtn() { //функция для кнопки регистрации
    this.emailCheck = this.emailRegExp.test(this.email) //проверка пароля и почты на соответствие регулярным выражениям
    this.passwordCheck = this.passwordRegExp.test(this.password)
    if(this.emailCheck && this.passwordCheck){ //если подходят
      this.service.register(this.fullname, this.email, this.password).subscribe( //через userService вызываем функцию register
      (res: IUserFeedback) => { //при успешной регистрации 
        sessionStorage.setItem("token", res.token); //сохраняем токен в sessionStorage 
        this.router.navigate(['/']); //редирект на главную
      },
      (err : HttpErrorResponse) => { //при ошибке 
        if(err.status == 401){ //статус установлен сервисом
          alert("Почта или пароль уже заняты!")
        }else{
          alert("Упс, что-то пошло не так!")
        }
      }
    )
    }else{ //если почта/пароль не подходят флаг и стиль меняется
      /* emailCheck ? null : alert("email");
      passwordCheck ? null : alert("passwordCheck"); */
    }
  }

  loginBtn(){ //функция для кнопки входа
    this.emailCheck = this.emailRegExp.test(this.email) //проверка пароля и почты на соответствие регулярным выражениям
    this.passwordCheck = this.passwordRegExp.test(this.password)
    if(this.emailCheck && this.passwordCheck){ //если подходят
      this.service.login(this.email, this.password).subscribe( //через userService вызываем функцию login
      (res: IUserFeedback) => { //при успешном входе 
        sessionStorage.setItem("token", res.token); //сохраняем токен в sessionStorage 
        this.router.navigate(['/']); //редирект на главную
      },
      (err : HttpErrorResponse) => { //при ошибке 
        if(err.status == 401){ //статус установлен сервисом
          alert("Пользователь не найден!")
        }else{
          alert("Упс, что-то пошло не так!")
        }
      }
    )
    }else{ //если почта/пароль не подходят флаг и стиль меняется
      /* this.emailCheck ? null : alert("email");
      this.passwordCheck ? null : alert("passwordCheck"); */
    }
  }
}