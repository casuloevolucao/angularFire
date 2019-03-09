import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataService } from '../services/Data.service';
import { Lideres } from '../models/lideres.model';
import {  } from 'angular-datatables'
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

//@Auhtor ismael alves
@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
   //formulario
  form:FormGroup = new FormGroup({
    "id": new FormControl(''),
    "nome": new FormControl('', [Validators.required]),
    "idade": new FormControl('', [Validators.required]),
    "foto": new FormControl(''),
    "contato": new FormControl('', [Validators.required]),
    "email": new FormControl('', [Validators.required, Validators.email]),
  })
 
  /*form = this.fb.group({
    id: ['', Validators.required],
    nome: ['', Validators.required],
    idade: ['', Validators.required],
    foto: [''],
    contato: [''],
    email: ['', Validators.required, Validators.email],
  })*/

  //referencia ao modal no front
  modalRef: BsModalRef;

  //lista de resultado vindo do firebase
  results:Lideres[] = new Array<Lideres>()

  //option da tabela
  dtOptions:DataTables.Settings = {}
  
  //controlado de dados da tabela
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private dataS:DataService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        processing:    'Procesando...',
        lengthMenu:    "Mostrar _MENU_ registros",
        zeroRecords:   "nenhum resultado encontrado",
        emptyTable:    "Não há dados disponíveis nesta tabela",
        info:          "Mostrando registros de _START_ a _END_ de um total de _TOTAL_ registros",
        infoEmpty:     "Mostrando registros de 0 a 0 do total de 0 registros",
        infoFiltered:  "(filtrando um total de registros _MAX_)",
        infoPostFix:   "",
        search:        "Pesquisar:",
        url:           "",
        thousands:  ",",
        loadingRecords: "Carregando...",
        paginate: {
            first:    "Primeiro",
            last:    "Último",
            next:    "Proximo",
            previous: "Anterior"
        },
        aria: {
            sortAscending:  ": Ative para ordenar a coluna ascendente ",
            sortDescending: ": Ative para ordenar a coluna de maneira descendente "
        }
      },
      pageLength: 5,
      processing: true
    }
   this.dataS.getData().subscribe(rs=>{
     this.results = rs
     this.dtTrigger.next();
   })
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  //metodo de chamada do modal
  createModal(add:TemplateRef<any>){
    this.modalRef = this.modalService.show(add);
  }

  //metodo de chamada do modal
  editModal(edit:TemplateRef<any>, lideres:Lideres){
    this.form.patchValue({
      id: lideres.id,
      nome:lideres.nome,
      idade:lideres.idade,
      foto:lideres.foto,
      contato:lideres.contato,
      email:lideres.email,
    })//passa as informações do front para o form
    this.modalRef = this.modalService.show(edit);
  }

  //metodo deletar
  delete(lideres:Lideres){
    Swal.fire({
      title: 'Voçe tem certeza?',
      text: "Você não poderá reverter isso!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, exclua!'
    }).then((result) => {
      if (result.value) {
        this.dataS.deleteData(lideres).then(rs =>{
          this.ngOnInit()
          Swal.fire(
            'Deletado!',
            'Seu arquivo foi excluído.',
            'success'
          )
        }) 
      }
    })
  }

  //metodo editar
  editar(){
    let editar = new Lideres(this.form.value) 
    this.dataS.editData(editar).then(rs =>{
      Swal.fire({
        position: 'top-end',
        type: 'success',
        title: `O ${editar.nome} foi alterado com sucesso!!!`,
        showConfirmButton: false,
        timer: 1500
      })
      this.form.reset() //limpar o formulario
      this.modalRef.hide() // fechar o modal
    })
  }

  //metodo criar
  create(){
    let create = new Lideres(this.form.value)
    this.dataS.createData(create).then(rs=>{
      Swal.fire({
        position: 'top-end',
        type: 'success',
        title: `O ${create.nome} foi criado com sucesso!!!`,
        showConfirmButton: false,
        timer: 1500
      })
      this.form.reset() //limpar o formulario
      this.modalRef.hide()// fechar o modal
    })
  }
  
}
