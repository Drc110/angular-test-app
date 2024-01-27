export interface Ipost { //интерфейс описания сущности постов 
    id: Number, //генерируется сервером
    date: string,
    content: [{
        data: string,
    }],
    user: { //генерируется сервером
        fullname: string,
        email: string,
        id: number
    }
}