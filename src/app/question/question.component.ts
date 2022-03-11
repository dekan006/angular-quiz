import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { interval } from 'rxjs';
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
  delayAnswer: number = 1000;
  interval$: any;
  progress: string = '0';
  isQuizCompleted : boolean = false;
  disabledButton : boolean = true;
  
  faChevronLeft= faChevronLeft;
  faChevronRight = faChevronRight;
  faRefresh = faRefresh;

  constructor(private questionServise : QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name') || '';
    this.getAllQuestions();  
  }
  getAllQuestions() {
    this.questionServise.getQuestionJson()
    .subscribe(res => {
      this.questionList = res.questions;
    } )
    this.startTimer();
  }

  nextQuestion() {
    this.currentQuestion++;
  }
  previousQuestion() {
    this.currentQuestion--;
  }
  answer(currentQuestion: number, option: any) {
    setTimeout(()=> {
    this.disabledButton = false;
    }, 5000)
    if(currentQuestion === this.questionList.length) {
      setTimeout(() => {
        this.isQuizCompleted = true;
      }, this.delayAnswer)
    }
    if (option.correct){
      this.points += this.counter;

      setTimeout(()=> {
        this.currentQuestion++;
        this.correctAnswer++;
        this.getProgressPercent();
        
      }, this.delayAnswer);
      this.resetTimer();
    } else {
      
      setTimeout(()=> {
        this.currentQuestion++;
        this.inCorrectAnswer++;
        this.getProgressPercent();
        
      }, this.delayAnswer);
      this.resetTimer();
    }
    this.disabledButton = true;
  }

  startTimer() {
    this.interval$ = interval(this.delayAnswer)
      .subscribe(val => {
      this.counter--; 
      if ( !this.counter) {
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
    if (this.questionList.length === 0) {
      return 0;
    }
    this.progress = (((this.correctAnswer + this.inCorrectAnswer)/this.questionList.length)*100).toString();
    return this.progress;
  }

  getCorrectPercent(){
    if (this.questionList.length === 0) {
      return 0;
    }
    return Math.round((this.correctAnswer/this.questionList.length)*100)
  }
  

}
