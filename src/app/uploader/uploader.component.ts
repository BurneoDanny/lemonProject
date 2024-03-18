import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import axios from 'axios'; // Asegúrate de que Axios esté instalado e importado correctamente
import { environment } from '../../environment/environment'; // Asegúrate de que la ruta de importación es correcta

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

  private currentIndex = 0;

  ngOnInit() {
    const interval = 5000;
    this.intervalId = setInterval(this.changeImage.bind(this), interval);
  }

  ngOnDestroy() {
    this.flag = false;
    clearInterval(this.intervalId);
  }

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

  async onFileSelected(event: any) { // Marcado como async
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post(`${environment.MODEL_JSON_URL}/predict`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data.prediction);
        this.lemonResult = response.data.prediction;

        // Lee y muestra la imagen seleccionada
        const reader = new FileReader();
        reader.onloadend = (e: any) => {
          const result = document.getElementById('result') as HTMLImageElement;
          result.src = e.target.result;
        };
        this.flag = true;
        this.startGsapAnimation();
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error al enviar la imagen:', error);
      }
    }
  }
}
