import { Ipost } from "./IPost";

export interface IMokky { //сущность для получения постов с учетом пагинации 
    items: Ipost[],
    meta: {
        total_items: number,
        total_pages: number,
        current_page: number,
        per_page: number,
        remaining_count: number
    }
}