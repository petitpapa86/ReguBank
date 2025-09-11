import { Component, signal } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet/>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ReguBank');
}
