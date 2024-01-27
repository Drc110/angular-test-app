export class UnderlineTool{ //свой инструмент для EditorJs (подчеркнутый текст)
    api
    button! : HTMLButtonElement
    _state
    tag = 'U'

    static get isInline() { //геттер 
        return true;
    }

    get state() { //метод получения состояния
        return this._state;
    }

    set state(state) { //метод установки состояния
        this._state = state;

        this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
    }

    constructor({ api }: { api: import('@editorjs/editorjs').API }) {
        this.api = api;
        this._state = false;
    }

    render() { //метод отрисовки в ToolBar
        this.button = document.createElement('button');//создание кнопки
        this.button.type = 'button';
        this.button.innerHTML = '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
        this.button.classList.add(this.api.styles.inlineToolButton);//добавление

        return this.button; //вернули кнопку
    }

    wrap(range : Range) { //получаем range
        const u = document.createElement(this.tag); //создаем тег
        u.appendChild(range.extractContents()); //получаем контент и оборачиваем в тег
        range.insertNode(u); //вставляем в начало тег
        this.api.selection.expandToTag(u); //расширяем selection до этого тега
    }

    unwrap(termWrapper : HTMLElement) { //получаем HTMLElement
        this.api.selection.expandToTag(termWrapper); //расширяем selection до этого элемента

        const sel = window.getSelection(); //получаем selection obj
        const range = sel!.getRangeAt(0); //получаем range

        const unwrappedContent = range.extractContents(); //получаем контент

        termWrapper.parentNode!.removeChild(termWrapper); //удаляем текущий элемент

        range.insertNode(unwrappedContent); //вставляем контент
    }

    surround(range : Range) { //метод при нажатии из ToolBar
        if (!range) {  //проверка на пустой range
            return;
        }
      
        const termWrapper = this.api.selection.findParentTag(this.tag); //метод из API

        if (termWrapper) { //если есть тег <u> то вызов unwrap()
            this.unwrap(termWrapper);
        } else { //если нет то вызов wrap()
            this.wrap(range);
        }
    }

    checkState() { //вызов при нажатии на ToolBar
        const mark = this.api.selection.findParentTag(this.tag); //ищем тег

        this.state = !!mark; //конвертируем в boolean
    }

    static get sanitize() { //метод коректного сохранения/отрисовки
        return {
          u: {} //возвращаем наш тег
        };
    }
}