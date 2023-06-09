import { Component, OnInit,Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibrosService } from 'src/app/Services/libros.service';
import { libro } from 'src/app/libro';
import { libros } from 'src/app/interfaces/libros.interface';
import { Router } from '@angular/router';
import { LibrosIdiomasService } from 'src/app/Services/libros-idiomas.service';
import { ValidateTokenService } from 'src/app/Services/validate-token.service';
@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent implements OnInit{

  libros?:libros[];
  librosDatos?:libros[];
  form: FormGroup;
  libro?: libros;
  mostrarFormulario: boolean = false;
  rol_id = localStorage.getItem('rol_id');

  constructor(
    private fb:FormBuilder,
    private libroService: LibrosService,
    private router: Router,
    private libroIdiomaServie:LibrosIdiomasService,
    private TokenService:ValidateTokenService
  ){
    this.form = this.fb.group({
      "nombre":['', Validators.required]
    })
  }

  ngOnInit(){
      this.getLibrosDatos();
      this.getLibros();
  }

  getLibros(){
    this.libroService.getLibro().subscribe(
      (libros) => {
        this.libros = libros
      }
    )
  }

  getLibrosDatos(){
    this.libroService.getLibroDatos().subscribe(
      (libros) => {
        this.librosDatos = libros
      }
    )
  }

  agregar_Actualizar(lib:libros){
    console.log(lib);
    this.libroService.selectLibro = Object.assign({},lib);
    this.router.navigate(['Libros/actualizar']);
  }

  Eliminar(idLibro:number)
  {
    this.TokenService.getValidateEliminar().subscribe(data => 
      {
        if (confirm("¿Estas seguro de eliminar al Autor?")){
          console.log(idLibro);
          this.libroService.deletLibro(idLibro).subscribe(()=>{
            this.getLibros();
          });
        }
      },
      error => {
      alert("Hubo un cambio, vuelva a iniciar sesion!"); 
       localStorage.removeItem('Token');
        localStorage.removeItem('UserID');
        localStorage.removeItem('rol_id');
        localStorage.removeItem('status');
        localStorage.removeItem('name');
      this.router.navigate(['Entrar']);
      });
  }

  agregarIdioma(lib:libros){
    console.log(lib);
    this.libroIdiomaServie.selectLibro = Object.assign({},lib)
    this.router.navigate(['LibrosIdiomas']);
  }

}
 