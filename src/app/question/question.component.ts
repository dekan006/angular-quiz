import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { interval, subscribeOn } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  name: string = '';
  questionList : any = [];
  currentQuestion : number = 0;
  points: number = 0;
  limitTimeQuestion: number = 60;
  pointsUpQuestion: number = 10;
  counter : number = this.limitTimeQuestion;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = '0';
  isQuizCompleted : boolean = false;
  

  constructor(private questionServise : QuestionService) { }

  faChevronLeft= faChevronLeft;
  faChevronRight = faChevronRight;
  faRefresh = faRefresh;

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startTimer();
  }
  getAllQuestions() {
    this.questionServise.getQuestionJson()
    .subscribe(res => {
      this.questionList = res.questions;
    } )
  }

  nextQuestion() {
    this.currentQuestion++;
  }
  previousQuestion() {
    this.currentQuestion--;
  }
  answer(currentQuestion: number, option: any) {
    if(currentQuestion === this.questionList.length) {
      setTimeout(() => {
        this.isQuizCompleted = true;
      }, 800)
    }
    if (option.correct){
      this.points += this.counter;

      setTimeout(()=> {
        this.currentQuestion++;
        this.correctAnswer ++;
        this.getProgressPercent();
        
      }, 1000);
      this.resetTimer();
    } else {
      
      setTimeout(()=> {
        this.currentQuestion++;
        this.inCorrectAnswer++;
        this.getProgressPercent();
        
      }, 1000);
      this.resetTimer();
    }
    
  }

  startTimer() {
    this.interval$ = interval(1000)
      .subscribe(val => {
      this.counter--; 
      if ( this.counter === 0) {
        this.currentQuestion++;
        this.counter = this.limitTimeQuestion;
      }
    });
    }

  stopTimer() {
    this.counter = 0;
    this.interval$.unsubscribe();
    
  }
  resetTimer() {
    this.stopTimer();
    this.counter = this.limitTimeQuestion;
    this.startTimer();
  }

  resetQuiz() {
    this.resetTimer();
    this.getAllQuestions();
    this.points = 0;
    this.counter = this.limitTimeQuestion;
    this.currentQuestion = 0;
    this.progress = "0";
    this.correctAnswer = 0;
    this.inCorrectAnswer = 0;
  }

  getProgressPercent(){
    this.progress = (((this.correctAnswer + this.inCorrectAnswer)/this.questionList.length)*100).toString();
    return this.progress;
  }

  getCorrectPercent(){
    return Math.round((this.correctAnswer/this.questionList.length)*100)
  }

}
