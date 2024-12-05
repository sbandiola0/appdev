import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { HomeComponent } from '../../home/home.component';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, RouterModule, HomeComponent, UserComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
