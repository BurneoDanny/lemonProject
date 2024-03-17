import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
//import { SplitText } from 'gsap-trial/SplitText';
import ScrollTrigger from 'gsap-trial/ScrollTrigger';

@Component({
  selector: 'app-section2',
  templateUrl: './section2.component.html',
  styleUrls: ['./section2.component.css']
})
export class Section2Component implements OnInit {


  ngOnInit(): void {
    //gsap.registerPlugin(ScrollTrigger, SplitText);
    gsap.registerPlugin(ScrollTrigger);
    //const splitText = new SplitText('#titulo', { type: 'chars' });
    //const splitText2 = new SplitText('#section ul > li ', { type: 'chars' });
    //this.scrollAnimations(splitText.chars, splitText2.chars);
    gsap.to(".lemon", {
      duration: 1.1,
      scale: 1.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "center center",
    });

  }

  scrollAnimations(chars: any[], chars2: any[]) {
    const scrollTrigger = {
      trigger: "#section",
      start: "top top",
      end: "+=150%",
      pin: true,
      scrub: 0.75,
    };
    const tl = gsap.timeline({
      scrollTrigger: scrollTrigger,
      defaults: {
        duration: 0.9,
        ease: "sine.inOut"
      }
    });
    tl.to(chars, {
      color: "#fff",
      stagger: 0.1,
    })
      .to(chars2, {
        color: "#fff",
        stagger: 0.1,
      }, "-=0.9");
  }



}
