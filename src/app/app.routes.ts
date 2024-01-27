import { Routes } from '@angular/router';
import { CreateComponent } from './pages/create/create.component';
import { MainComponent } from './pages/main/main.component';
import { UserComponent } from './pages/user/user.component';
import { EditPostComponent } from './pages/edit-post/edit-post.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [ //прописываем роутинг по компонентам
    { path: '', component: MainComponent},
    { path: 'create', component: CreateComponent},
    { path: 'user', component: UserComponent},
    { path: 'editPost/:id', component: EditPostComponent},
    { path: '**', component: NotFoundComponent}
];
