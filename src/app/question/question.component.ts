// import { Component, OnInit } from '@angular/core';
// import { interval } from 'rxjs';
// import { QuestionService } from '../question.service';
// import { Router } from '@angular/router';


// @Component({
//   selector: 'app-question',
//   templateUrl: './question.component.html',
//   styleUrls: ['./question.component.css'],
// })
// export class QuestionComponent implements OnInit {
//   public name: string = '';
//   public questionList: any = [];
//   public currentQuestion: number = 0;
//   public points: number = 0;
//   counter = 30;
//   correctAnswer: number = 0;
//   inCorrectAnswer: number = 0;
//   interval$: any;
//   progress: string = '0';
//   isQuizCompleted: boolean = false;
//   nextPageUrl:any;
//   nameKey: any;
//   homePage:any;
//   constructor(private questionService: QuestionService, private router: Router) {}

//   ngOnInit(): void {
//     this.name = localStorage.getItem('name')!;
//     this.getAllQuestions();
//     this.startCounter();
//   }
//   getAllQuestions() {
//     this.questionService.getQuestionJson().subscribe((res) => {
//       this.questionList = res.questions;
//     });
//   }
//   nextQuestion() {
//     this.currentQuestion++;
//   }
//   previousQuestion() {
//     this.currentQuestion--;
//   }
//   answer(currentQno: number, option: any) {
//     // two parameter

//     // if (currentQno > this.questionList.length) {
//     //   this.isQuizCompleted = true;
//     //   this.startCounter();
//     // }

//     if (option.correct) {
//       this.points += 1;
//       this.correctAnswer++;
//       setTimeout(() => {
//         this.currentQuestion++;
//         this.resetCounter();
//         this.getProgressPercent();
//         if (currentQno === this.questionList.length) {
//           this.showResult()
//           this.startCounter();
//         }
//       }, 1000);
//     } else {
//       setTimeout(() => {
//         this.currentQuestion++;
//         this.inCorrectAnswer++;
//         this.resetCounter();
//         this.getProgressPercent();
//         if (currentQno === this.questionList.length) {
//           this.showResult()
//           this.startCounter();
//         }
//       }, 1000);

//       //this.points -= 1;
//     }
//   }

//   showResult(){
//     this.isQuizCompleted = true;
//     setTimeout(() => {
//       this.router.navigate(['/']);
//     },13000)
//   }
//   startCounter() {
//     this.interval$ = interval(1000).subscribe((val) => {
//       this.counter--;
//       if (this.counter === 0) {

//         //this.counter = 30;
//         //this.points -= 1;
//       }
//     });
//     setTimeout(() => {
//       this.interval$.unsubscribe();
//     }, 600000);
//   }
//   stopCounter() {
//     this.interval$.unsubscribe();
//     this.counter = 0;
//   }
//   resetCounter() {
//     this.stopCounter();
//     //this.counter = 30;
//     this.startCounter();
//   }
//   resetQuiz() {
//     this.resetCounter();
//     this.getAllQuestions();
//     this.points = 0;
//     // this.counter = 30;
//     //this.currentQuestion = 1;
//     this.progress = '0';
//   }
//   getProgressPercent() {
//     this.progress = (
//       (this.currentQuestion / this.questionList.length ) *
//       100
//     ).toString();
//     return this.progress;
//   }
//   // navigateToNextPage(): void {
//   //     this.counter = 30;
//   //   const nextPageUrl = 'http://localhost:4200/welcome'; 
//   //   this.router.navigateByUrl(nextPageUrl);
//   // }


//   }




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
  isSegmentDisplay: boolean = true;
  currentSegment: string = '';
  segments: string[] = ['General Knowledge', 'Product-Based'];
  segmentIndex: number = 0;
  filteredQuestions: any = [];
  segmentScores: { [key: string]: number } = {}; // Stores correct answers per segment
  answers: any[] = [];  
  constructor(private questionService: QuestionService, private router: Router) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
  }

  getAllQuestions() {
    this.questionService.getQuestionJson().subscribe((res) => {
      this.questionList = res.questions;
      this.showSegmentTitle();
    });
  }

  showSegmentTitle() {
    this.currentSegment = this.segments[this.segmentIndex];
    this.isSegmentDisplay = true;

    setTimeout(() => {
      this.isSegmentDisplay = false;
      this.filterQuestionsBySegment();
      this.startCounter();
    }, 2000);
  }

  filterQuestionsBySegment() {
    this.filteredQuestions = this.questionList.filter(
      (q: any) => q.segment === this.currentSegment
    );
  }

  nextQuestion() {
    this.currentQuestion++;

    if (this.currentQuestion >= this.filteredQuestions.length) {
      this.currentQuestion = 0;
      this.segmentIndex++;

      if (this.segmentIndex < this.segments.length) {
        this.showSegmentTitle();
      } else {
        this.isQuizCompleted = true;
        this.showResult();
      }
    } else {
      this.resetCounter();
    }
  }

  answer(currentQno: number, option: any) {
    // Store answer correctness without immediate feedback
    this.answers.push({
      question: currentQno,
      selectedOption: option,
      isCorrect: option.correct
    });

    this.resetCounter();
    this.getProgressPercent();

    // Move to the next question after a short delay
    setTimeout(() => {
      this.nextQuestion();
    }, 1000);
  }

  showResult() {
    this.isQuizCompleted = true;
    // Calculate scores based on stored answers
    this.answers.forEach((answer) => {
      if (answer.isCorrect) {
        this.points++;
        if (!this.segmentScores[this.currentSegment]) {
          this.segmentScores[this.currentSegment] = 0;
        }
        this.segmentScores[this.currentSegment]++;
      }
    });
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }

  getSegmentQuestionCount(segment: string): number {
    return this.questionList.filter((q: any) => q.segment === segment).length;
  }

  startCounter() {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }

    this.counter = 5;

    this.interval$ = interval(1000).subscribe(() => {
      this.counter--;
      if (this.counter === 0) {
        this.nextQuestion();
      }
    });
  }

  stopCounter() {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }
    this.counter = 0;
  }

  resetCounter() {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }
    this.startCounter();
  }

  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.correctAnswer = 0;
    this.inCorrectAnswer = 0;
    this.progress = '0';
    this.isQuizCompleted = false;
    this.currentQuestion = 0;
    this.segmentIndex = 0;
    this.segmentScores = {};
    this.answers = [];
    this.showSegmentTitle();
  }

  getProgressPercent() {
    this.progress = (
      (this.currentQuestion / this.filteredQuestions.length) *
      100
    ).toString();
    return this.progress;
  }
}