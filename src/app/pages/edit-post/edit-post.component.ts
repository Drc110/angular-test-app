import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Ipost } from '../../services/IPost';
import { postService } from '../../services/postService';
import EditorJS from '@editorjs/editorjs';
import { UnderlineTool } from '../../services/UnderlineTool';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss'
})

export class EditPostComponent implements OnInit{
  id = -1 //ставим невозможное id поста
  currentPost! : Ipost //создаем шаблоны текущей записи, EditorJs, нового содержания поста
  editor! : EditorJS 
  data : EditorJS.OutputData = {blocks : []}

  @ViewChild('editorjs', { read: ElementRef, static: true }) editorElement!: ElementRef; //создаем ViewChild на чтение #editorjs

  constructor(private route : ActivatedRoute, private http: HttpClient, private service : postService, private router: Router){}

  ngOnInit(): void { //вызов при инициализации компонента
    this.route.url.subscribe(el =>  //из ActivatedRoute получаем id поста
      this.id = Number(el[1]) //ставим в this.id
    );
    const token = sessionStorage.getItem("token"); //получаем токен
    this.http.get<Ipost>(`https://95f407c957ff95e8.mokky.dev/posts/${this.id}`, {headers: {Authorization: `Bearer ${token}`}}).subscribe(post => { //get метод на этот пост
      this.currentPost = post, //обновление текущего поста
      post.content.forEach(target => { //приводим контент из апи вида массив строк в тип EditorJS.OutputData["blocks"]
        const temp = {
          type: "paragraph",
          data:{
            text: target
          }
        }
        this.data.blocks.push(temp) //кладем в шаблон
      }),
      this.editor = new EditorJS({ //создаем объект типа EditorJS
        minHeight: 10,
        holder : this.editorElement.nativeElement, //в #editorjs
        data: this.data, //удобно помещаем в объект данные которые получили из апи
        tools: {underline: UnderlineTool}
      })
    })
  }

  updateBtn() { //функция кнопки "обновить запись"
    this.editor.save().then(blocks => { //получаем данные из EditorJs при помощи .save
      this.service.pathPost(this.id, blocks.blocks).subscribe( //вызваем функцию pathPost из сервиса, передаем id и новый контент
        (res) => {
          this.router.navigate(['/']); //редирект на главную
          //console.log(res)
        },
        (err) => {
          alert(err)
        }
      )
    })
  }
}