import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { postService } from '../../services/postService'
import { FormsModule } from '@angular/forms';
import EditorJS from '@editorjs/editorjs';
import { Router } from '@angular/router';
import { UnderlineTool } from '../../services/UnderlineTool';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class CreateComponent implements OnInit{
  editor!: EditorJS //создаем шаблон EditorJs

  @ViewChild('editorjs', { read: ElementRef, static: true }) editorElement!: ElementRef; //создаем ViewChild на чтение #editorjs
  
  constructor(private service : postService, private router: Router) {}

  createBtn(){ //функция для кнопки создания поста
    this.editor.save().then(blocks => { //получаем данные из EditorJs при помощи .save
      this.service.createPost(blocks.blocks).subscribe(
        (res) => {
          this.router.navigate(['/']);//редирект на главную
          //console.log(res)
        },
        (err) => {
          alert(err)
        }
      )
    })
  }

  ngOnInit(): void { //вызов при инициализации компонента
    this.editor = new EditorJS({ //создаем объект типа EditorJS
      minHeight: 10,
      holder : this.editorElement.nativeElement,
      tools: {underline: UnderlineTool}
    })
  }
}
