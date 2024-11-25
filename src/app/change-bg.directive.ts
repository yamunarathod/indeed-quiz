import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appChangeBg]'
})

export class ChangeBgDirective {
 

  @Input() isCorrect : Boolean = false;
  constructor(private el : ElementRef, private render : Renderer2) { }
  @HostListener('click') answer(){
    if(this.isCorrect){
      
      this.render.setStyle(this.el.nativeElement,'background','linear-gradient(90deg, rgba(0,238,110,1) 0%, rgba(12,117,230,1) 100%)');
      this.render.setStyle(this.el.nativeElement,'color','#fff');
      this.render.setStyle(this.el.nativeElement,'border','2px solid grey');
    }else{
      this.render.setStyle(this.el.nativeElement,'background',' linear-gradient(90deg, rgba(255,15,123,1) 0%, rgba(248,155,41,1) 100%)');
      this.render.setStyle(this.el.nativeElement,'color','#fff');
      this.render.setStyle(this.el.nativeElement,'border','2px solid grey');
    }
  }
}
