import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-welcom',
  templateUrl: './welcom.component.html',
  styleUrls: ['./welcom.component.scss']
})
export class WelcomComponent {

  startQuiz(name: string) {
    localStorage.setItem("name", name)
  }
}
