export interface IUserFeedback { //интерфейс описания сущности ответа сервера
    data: {
        email: string,
        fullname : string,
        id: string,
        password : string
    },
    token: string
}