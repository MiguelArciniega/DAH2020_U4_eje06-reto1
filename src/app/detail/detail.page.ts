import { Component, OnInit } from '@angular/core';
import { Estudiante } from '../models/estudiante';
import { EstudianteService } from '../services/estudiante.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  public myForm: FormGroup;
  student: Estudiante;
  payLoad: any;

  constructor(private service: EstudianteService,
    private actroute: ActivatedRoute,
    private router: Router,
    private toast: ToastController,
    private fb: FormBuilder) {
    this.actroute.queryParams.subscribe(
      params => {
        if (params && params.special) {
          this.student = JSON.parse(params.special) as Estudiante;
          console.log(this.student);
        }
      }
    );
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: [''],
      controlnumber: [''],
      curp: [''],
      age: [0],
      active: [false]
    });
    this.cleanInputs();
  }

  delete(id: string) {
    this.service.deleteStudent(id);
    this.presentToast();
    this.router.navigate(['/']);
  }

  update(student: Estudiante, active: boolean) {
    student.active = active;
    console.log(student.active);
    console.log(this.payLoad = JSON.stringify(this.myForm.value))
    student.age = this.myForm.controls.age.value;
    student.curp = this.myForm.controls.curp.value;
    this.service.updateStudent(student, student.id);
  }

  private cleanInputs(): void {
    const regex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.myForm = this.fb.group({
      name: [this.student.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(150)])],
      controlnumber: [this.student.controlnumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      age: [this.student.age, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      curp: [this.student.curp, Validators.compose([Validators.required, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
      )])],
      active: [this.student.active, Validators.compose([Validators.required])],
    });
  }

  async presentToast() {
    const t = await this.toast.create({
      message: 'Estudiante eliminado',
      duration: 2000
    });
  }

  // t.present();
}
