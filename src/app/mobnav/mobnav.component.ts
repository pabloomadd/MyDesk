import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-mobnav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mobnav.component.html',
  styleUrl: './mobnav.component.css'
})
export class MobnavComponent {

}
