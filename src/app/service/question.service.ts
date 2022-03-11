import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionsList } from 'src/app/model/questions-list'

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  getQuestionJson() {
    return this.http.get<QuestionsList>('assets/questions.json');
  }
}
