import { Component,OnInit } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Platform } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';




import * as $ from 'jquery';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {


  alarma = false;
  reproducir: boolean = false;
  subscription: any;

 


  constructor(public deviceMotion: DeviceMotion, private flashlight: Flashlight, public platform: Platform,private vibration: Vibration) {

  }

  ngOnInit() {
    
  }

  toggle() {
    if ($("#holder").hasClass('off') || $("#holder").hasClass('on')) {
      $(".holder").toggleClass('off');
      $(".holder").toggleClass('on');
      if ($("#holder").hasClass('on')) {
        this.alarma = true;
        $(".validacion-pass").css('opacity','1');
        $(".cierre").addClass("cerrado");
        $(".lock-container").addClass("color-cerrado");
        $(".keyhole").addClass("color-cerrado");
        $(".container-toggle").fadeOut();
      } else {

        this.alarma = false;
        $(".cierre").removeClass("cerrado");
        $(".lock-container").removeClass("color-cerrado");
        $(".keyhole").removeClass("color-cerrado");
      }
    } else {
      $("#holder").addClass('on');
    }
    if (this.alarma == true) {
      this.start();
    } else {
      this.stop();
    }
  }

  validarDesbloqueo() {
    let pass = $(".input-desbloqueo").val();
    if(localStorage.getItem('key') == pass)
    {
      $(".container-toggle").fadeIn();
      $(".validacion-pass").css('opacity','0');
      $(".input-desbloqueo").val("");
    }
  }


  start() {

    try {
      const option: DeviceMotionAccelerometerOptions = {
        frequency: 2000
      };

      this.subscription = this.deviceMotion.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData) => {
        
        console.log(acc.x,acc.y,acc.z);

        if(acc.x > 3 && acc.x < 6) {
          this.reproducirAudio("../assets/audio/saca_la_mano.mp3");
        } else if(acc.x < -3 && acc.x > -6) {
          this.reproducirAudio("../assets/audio/solta_eso.mp3");
        } else if(acc.y > 4) {
          this.flashlight.switchOn();
          this.reproducirAudio("../assets/audio/la_purga.mp3");
          setTimeout(() => {
            this.flashlight.switchOff()
          }, 5000);
        } else if (acc.x > 8 || acc.x < -8) {
          this.vibration.vibrate(5000);
          this.reproducirAudio("../assets/audio/fort.mp3");
        }
        

      });
    } catch (err) {
      alert('Error ' + err);
    }

  }
  stop() {
    

    this.subscription.unsubscribe();
  }
  
  reproducirAudio(ruta: string)
  {
    let audio = new Audio(ruta);
    audio.play();
    this.reproducir = true;
    setTimeout(() => {
      this.reproducir = false;
    },3000);
  }

  



}