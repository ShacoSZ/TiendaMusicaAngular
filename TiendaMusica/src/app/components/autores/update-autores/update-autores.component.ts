import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Autor as a } from 'src/app/autor';
import { Autor } from 'src/app/interfaces/autores.interface';
import { AutoresService } from 'src/app/Services/autores.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ValidateTokenService } from 'src/app/Services/validate-token.service';

@Component({
  selector: 'app-update-autores',
  templateUrl: './update-autores.component.html',
  styleUrls: ['./update-autores.component.css'],
  animations: [
    trigger('success', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 100 }))
      ]),
      transition(':leave', [
        style({ opacity: 100 }),
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class UpdateAutoresComponent implements OnInit{
  showSuccessMessage = false;
  showErrorMessage = false;
  autores?:Autor[];
  autor?: Autor;
  error: string = '';
  rol?:number;

  constructor(
    public autorService: AutoresService,
    private router: Router,
    private TokenService:ValidateTokenService
  ){ }

  ngOnInit(){
  }

  checarRol(){
    this.TokenService.getValidateRol().subscribe((rol)=>{
      this.rol = Number(rol);
      console.log(this.rol);
      if(!(this.rol == 1 || this.rol == 2)){
        alert("Usuario invalido, vuelva a iniciar sesion!"); 
        localStorage.clear();
        this.router.navigate(['Entrar']);
      }
    })
  }

  submitForm(autorForm:NgForm){
      this.checarRol();
      this.showSuccessMessage = true;
      this.showErrorMessage = false; // Agrega variable para manejar errores
      if(autorForm.value.id==null){
        this.autorService.createAutor(autorForm.value)
        .subscribe((response)=>{
          this.router.navigate(["Autores"]);
        }, (error) => { // Manejo de errores
          this.showErrorMessage = true;
          this.showSuccessMessage = false;
        });
      }else{
        this.autorService.updateAutor(autorForm.value.id,autorForm.value)
        .subscribe((response)=>{
          this.showSuccessMessage = true;
          this.router.navigate(["Autores"]);
        }, (error) => { // Manejo de errores
          this.showErrorMessage = true;
          this.showSuccessMessage = false;
        });
      }
      this.resetForm(autorForm);
  }

  regresar(autorForm:NgForm){
    this.resetForm(autorForm);
    this.router.navigate(['Autores']);
  }

  resetForm(autorForm:NgForm){
    this.showSuccessMessage = false
    if(autorForm!=null){
      autorForm.reset();
      this.autorService.selectAutor=new a();
    }
  }

}
