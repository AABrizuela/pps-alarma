import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { LoadingController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';


import * as $ from 'jquery';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mail: string = "";
  password: string = "";
  private loading;

  usuarios: Observable<any[]>;
  lista:any[]
  constructor(private vibration: Vibration, private statusBar: StatusBar, db: AngularFirestore,public router: Router, private loadingCtrl: LoadingController) {

    this.usuarios = db.collection('usuarios').valueChanges();
    this.usuarios.subscribe(usuarios => this.lista = usuarios, error => console.log(error));
  }

  ngOnInit() {
    //this.statusBar.overlaysWebView(true);
    //this.statusBar.isVisible = true;
    this.statusBar.styleLightContent();
    this.Spinner();
    this.clean();
  }


  Validando() {
    this.loadingCtrl.create({
      spinner: "crescent",
      message: 'Validando...'
    }).then((overlay) => {
      this.loading = overlay;
      this.loading.present();
    });

    setTimeout(() => {
      this.loading.dismiss();
    }, 2000);
  }

  Login() {
    
    this.mail = $("#correo").val();
    this.password = $("#pass").val();
    localStorage.setItem("key",this.password);
    if(this.ValidarEmail(this.mail)){
      
      if(this.ValidarPass(this.password)){
        
        let flag = false;
        for (let usuario of this.lista){
          if(usuario.correo == this.mail && usuario.clave == this.password){
            
            flag=true;
            
            this.Validando();
            setTimeout(()=>{
              this.router.navigate(['main']);
            }, 2000);
            break;
          }
        }
        if (!flag) {
            //this.statusBar.hide();
            $(".notificacion").addClass("active");
            $(".notificacion").addClass("error-password");
            this.vibration.vibrate(1000);
    
            setTimeout(function(){
              
            $(".notificacion").removeClass("active");
            $(".notificacion").removeClass("error-password");
          },2000);
        }
      }
      else{
        //this.statusBar.hide();
        $(".notificacion").addClass("active");
        $(".notificacion").addClass("error-password");
        this.vibration.vibrate(1000);

        setTimeout(function(){
          
         
        $(".notificacion").removeClass("active");
        $(".notificacion").removeClass("error-password");
      },2000);
      }
    }
    else{
      //this.statusBar.hide();
      $(".notificacion").addClass("active");
      $(".notificacion").addClass("error-mail");
      this.vibration.vibrate(1000);

      setTimeout(function(){
        
        $(".notificacion").removeClass("active");
        $(".notificacion").removeClass("error-mail");
        
      },2000);
    }
    this.clean();
  }

  clean()
  {
    this.mail=  "";
    this.password = "";
  }

  completar(){
    let correo =$('#select option:selected').val();
    for (let usuario of this.lista) {
      if(usuario.correo == correo){
        $("#correo").val(usuario.correo);
        $("#pass").val(usuario.clave);
        break;
      }
    }
  }

  // #region validaciones

  ValidarEmail(mail:string) : boolean
  {
    let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}.){1,125}[A-Z]{2,63}$/i;

    let retorno : boolean = false;

    if(regex.test(mail))
    {
        retorno = true;
    }

    return retorno;
  }

  ValidarPass(password: string) : boolean
  {
    let retorno : boolean = false;

    if(password.length >= 4)
    {
      retorno = true;
    }

    return retorno;
  }

  //#endregion


  //#region funciones jquery
  Open() {
      $('#login-button').fadeOut(function(){
        $('#container').fadeIn();
      });
      this.clean();
     
  }

  Close(){
     $('#container').fadeOut(function(){
       $('#login-button').fadeIn();
     });
     this.clean();
  }

  Spinner(){
    $(".fondo").addClass("loading");
    $(".spinner").css("display","block");

    setTimeout(function(){
      $(".fondo").removeClass("loading");
      $(".spinner").css("display", "none");
      $(".backdrop").attr("hidden", "true");
    },2000);
  }


  //#endregion

}
