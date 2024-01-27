import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
import { Ipost } from '../../services/IPost';
import { postService } from '../../services/postService';
import { RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [PostComponent, CommonModule, RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent implements OnInit{
  title = "main-page"
  posts: Ipost[] = [] //массив постов
  logged = false //флаг вошел ли пользователь в аккаунт
  currentPage = 1 //текущая страница
  onWindowScroll : Subject<void> = new Subject<void>(); //создаем пустой Subject под функцию бесконечной подгрузки постов и добавления в него debounceTime

  @HostListener('window:scroll') //вешаем HostListener на window:scroll
  onScrollToBottom(){ //логика функции
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight){
      this.onWindowScroll.next() //вызов Subject
    }
  }

  constructor(private service: postService){ //в конструкторе "собираем" функцию
    this.onWindowScroll.pipe(debounceTime(100)).subscribe(() => {   
      this.currentPage++ //итерация страницы 
      this.service.getAll(this.currentPage) //вызов метода из сервиса с новым значением
    })
  }

  ngOnInit() :void { //вызов при инициализации компонента
    this.currentPage = 1 //ставим текущую страницу на первую
    this.service.getAll(this.currentPage) //вызов метода из сервиса с новым значением
    this.service.posts$.subscribe(posts => { //подписываемся на посты
      this.posts = posts
    })

    if(sessionStorage.getItem("token") != null){ //проверка токена
      this.logged = true
    }
  }
}