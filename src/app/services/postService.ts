
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Ipost } from './IPost';
import { BehaviorSubject } from 'rxjs';
import { IMokky } from './IMokky';

@Injectable({
    providedIn: 'root',
})

export class postService{
    private postsSubject = new BehaviorSubject<Ipost[]>([]); //создаем BehaviorSubject типа Ipost[] для хранения и получения данных постов
    posts$ = this.postsSubject.asObservable(); //создаем копию для подписки из main.component.ts

    constructor(private http: HttpClient) {}

    getAll(page: number){ //функция получения страницы (не всех постов) (по умолчанию 10шт.)
        const token = sessionStorage.getItem("token") //получаем токен; //get запрос, сортировка по ближайшей дате, структура {headers : ...} по примеру документации сервиса
        let max = 0
        this.http.get<IMokky>(`https://95f407c957ff95e8.mokky.dev/posts?sortBy=-date&page=${page}`, {headers: {Authorization: `Bearer ${token}`}}).subscribe(el => {
            const currentPosts = (page == 1 ? [] : this.postsSubject.getValue()); //если первая страница то кладем пустой массив (метод вызывается в ngOnInit main.component
            const updatedPosts = [...currentPosts, ...el.items]; // и ранее вызывал дублирование постов); //объединяем текущие с новыми
            this.postsSubject.next(updatedPosts); //кладем все в postsSubject
        })
    }
    createPost(content : EditorJS.OutputData["blocks"]){ //функция создания поста, вызываем с аргументом типа блоков в EditorJS
        const token = sessionStorage.getItem("token") //получаем токен; //пост запрос с параметрами дата и контент (user и id генерируются сами)
        return this.http.post<Ipost>('https://95f407c957ff95e8.mokky.dev/posts', {date: new Date, content: content.map(el => el.data.text)}, {headers: {Authorization: `Bearer ${token}`}})
    }
    pathPost(id: Number, content : EditorJS.OutputData["blocks"]){ //функция редактирования поста по id и новому контенту
        const token = sessionStorage.getItem("token") //получаем токен ; //patch метод как в post
        return this.http.patch(`https://95f407c957ff95e8.mokky.dev/posts/${id}`, {date: new Date, content: content.map(el => el.data.text)}, {headers: {Authorization: `Bearer ${token}`}})
    }
    deletePost(id: Number){ //функция удаления поста
        const token = sessionStorage.getItem("token")//по классике; //delete метод и фильтрация текущих постов
        this.http.delete(`https://95f407c957ff95e8.mokky.dev/posts/${id}`, {headers: {Authorization: `Bearer ${token}`}}).subscribe(() =>{
            const filtered = this.postsSubject.value.filter(el => el.id != id)  
            this.postsSubject.next(filtered)
        })
    }
}