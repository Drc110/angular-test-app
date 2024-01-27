import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Ipost } from '../../services/IPost';
import { RouterLink } from '@angular/router';
import { postService } from '../../services/postService';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post! : Ipost //получаем объект типа Ipost 

  constructor(private service: postService){}

  deletePost(){ //функция для кнопки удаления поста
    this.service.deletePost(this.post.id) //вызов функции сервиса
  }
}
