import { Component, OnInit,Injectable,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoresService } from 'src/app/Services/autores.service';
import { Autor } from 'src/app/interfaces/autores.interface';
import { Router } from '@angular/router'; 
import { auto } from '@popperjs/core';
import { ValidateTokenService } from 'src/app/Services/validate-token.service';
import { socket } from 'src/environments/socket';

@Component({
  selector: 'app-autores',
  templateUrl: './autores.component.html',
  styleUrls: ['./autores.component.css']
})

@Injectable()
export class AutoresComponent implements OnInit{
  autores?:Autor[];
  form: FormGroup;
  autor?: Autor;
  mostrarFormulario: boolean = false;
  rol_id = localStorage.getItem('rol_id');
  rol?:number;

  constructor(
    private fb:FormBuilder,
    private autorService: AutoresService,
    private router: Router,
    private TokenService:ValidateTokenService,
    private change:ChangeDetectorRef
  ){
    this.form = this.fb.group({
      "nombre":['', Validators.required]
    })
  }

  roldecanela()
  {
    this.TokenService.getValidateRol().subscribe((rol)=>{
      this.rol = Number(rol);
      const resp = localStorage.getItem('rol_id');
      console.log(this.rol);
      if((!(this.rol == Number(resp)))&&(!(this.rol == 1 || this.rol == 2))){
        return false;
      }
      else{
        return true;
      }
    }) 
  }

  ngOnInit() {
      this.getAutores();
      this.rol_id = localStorage.getItem('rol_id')
      this.getSocket()
  }

  getAutores(){
    this.autorService.getAutores().subscribe((autores) => {this.autores = autores;})
  }

  Agregar(values: Autor){
    this.autorService.createAutor(values).subscribe(()=>{
      this.getAutores();
    });
  }

  Actualizar(aut:Autor){
    console.log(aut);
    this.autorService.selectAutor=Object.assign({},aut);
    this.router.navigate(['Autores/actualizar']);
  }

  getSocket(){
    socket.on('autores',(autores)=>{
      console.log(autores)
      this.autores = autores
      this.change.detectChanges()
    })
  }

  Eliminar(idAutor:number){
    this.TokenService.getValidateEliminar().subscribe(data => {
      if (confirm("¿Estas seguro de eliminar al Autor?")){
        console.log(idAutor);
        this.autorService.deleteAutor(idAutor).subscribe(()=>{               
          this.getAutores();
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


}
