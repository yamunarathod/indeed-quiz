import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../question.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  public name: string = '';
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 30;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = '0';
  isQuizCompleted: boolean = false;
  isShow: boolean = true;
  nextPageUrl:any;
  nameKey: any;
  homePage:any;
  constructor(private questionService: QuestionService, private router: Router) {}

  
  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startCounter();
  }
  getAllQuestions() {
    this.questionService.getQuestionJson().subscribe((res) => {
      this.questionList = res.questions;
    });
  }
  nextQuestion() {
    this.currentQuestion++;
  }
  previousQuestion() {
    this.currentQuestion--;
  }
  answer(currentQno: number, option: any) {
    // two parameter

    // if (currentQno > this.questionList.length) {
    //   this.isQuizCompleted = true;
    //   this.startCounter();
    // }

    if (option.correct) {
      this.points += 1;
      this.correctAnswer++;
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
        if (currentQno === this.questionList.length) {
          this.showResult()
          this.startCounter();
        }
      }, 1000);
    } else {
      setTimeout(() => {
        this.currentQuestion++;
        this.inCorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();
        if (currentQno === this.questionList.length) {
          this.showResult()
          this.startCounter();
        }
      }, 1000);

      //this.points -= 1;
    }
  }

  showResult(){
    this.isQuizCompleted = true;
    setTimeout(() => {
      this.router.navigate(['/']);
    },10000)
  }
  startCounter() {
    this.interval$ = interval(1000).subscribe((val) => {
      this.counter--;
      if (this.counter === 0) {
        
        //this.counter = 30;
        //this.points -= 1;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  resetCounter() {
    this.stopCounter();
    //this.counter = 30;
    this.startCounter();
  }
  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    // this.counter = 30;
    //this.currentQuestion = 1;
    this.progress = '0';
  }
  getProgressPercent() {
    this.progress = (
      (this.currentQuestion / this.questionList.length ) *
      100
    ).toString();
    return this.progress;
  }
  // navigateToNextPage(): void {
  //     this.counter = 30;
  //   const nextPageUrl = 'http://localhost:4200/welcome'; 
  //   this.router.navigateByUrl(nextPageUrl);
  // }


  }

