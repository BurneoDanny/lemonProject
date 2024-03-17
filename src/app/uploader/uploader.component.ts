import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import * as tf from '@tensorflow/tfjs';
import { environment } from '../../environment/environment';


@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit, OnDestroy, AfterViewInit {
  lemonResult: string | null = "...";

  imageUrls = [
    'assets/imgs/lemonRobot.jpg',
    'assets/imgs/lemonRobot2.jpg',
    'assets/imgs/lemonRobot3.jpg',
    'assets/imgs/lemonRobot4.jpg',
    'assets/imgs/lemonRobot5.jpg',
    'assets/imgs/lemonRobot6.jpg',
    'assets/imgs/lemonRobot7.jpg',
  ];

  private intervalId: any;

  flag = false;

  model: any;

  modelJSON = `${environment.MODEL_JSON_URL}/models/model.json`;

  ngOnInit() {
    const interval = 5000;
    this.intervalId = setInterval(this.changeImage.bind(this), interval);

    const loadModel = async () => {
      console.log("Attempting to load model...");
      try {
        const modelo = await tf.loadLayersModel(this.modelJSON);
        console.log("Model loaded:", modelo);
        this.model = modelo;
      } catch (e) {
        console.log("[LOADING ERROR] info:", e);
      }
    };

    loadModel();
  }

  ngOnDestroy() {
    this.flag = false;
    clearInterval(this.intervalId);
  }

  private currentIndex = 0;
  private changeImage() {
    const lemonImage = document.getElementById('lemonImage') as HTMLImageElement;
    const nextIndex = (this.currentIndex + 1) % this.imageUrls.length;
    const nextImageUrl = this.imageUrls[nextIndex];

    gsap.to(lemonImage, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        lemonImage.src = nextImageUrl;
        gsap.to(lemonImage, { opacity: 1, duration: 0.5 });
        this.currentIndex = nextIndex;
      }
    });
  }


  ngAfterViewInit() {
    if (this.flag) {
      this.startGsapAnimation();
    }
  }

  private startGsapAnimation() {
    const lemonImage = document.getElementById('result') as HTMLImageElement;
    gsap.from(lemonImage, { opacity: 0, duration: 0.5 });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const result = document.getElementById('result') as HTMLImageElement;
        result.src = e.target.result;
        this.predictImage(file);
      };
      this.flag = true;
      this.startGsapAnimation();
      reader.readAsDataURL(file);
    }
  }

  async predictImage(file: any) {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = async () => {

      const tensor = tf.browser.fromPixels(image).toFloat();
      const grayscale = tf.image.rgbToGrayscale(tensor);
      const resized = tf.image.resizeNearestNeighbor(grayscale, [150, 150]).expandDims();


      const prediction = this.model.predict(resized);
      const result = await prediction.data();

      this.lemonResult = result[0] > 0.5 ? 'El limon esta en buen estado' : 'El limon esta en mal estado';
    };
  };



}  
