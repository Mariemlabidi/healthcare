
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../services/doctor.service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Doctor {
  id?: number;
  name: string;
  title: string;
  image: string;
  address: string;
}

@Component({
  selector: 'app-admin-doctors',
  standalone:false,
  templateUrl: './admin-doctors.component.html',
  styleUrls: ['./admin-doctors.component.css']
})
export class AdminDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  doctorForm: FormGroup;
  isEditing = false;
  currentDoctorId: number | null = null;
  isLoading = false;
  searchTerm = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  
  constructor(
    private doctorService: DoctorService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      title: ['', Validators.required],
      address: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorService.getDoctors().subscribe({
      next: (data: Doctor[]) => {
        this.doctors = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading doctors', error);
        this.isLoading = false;
      }
    });
  }

  openModal(content: any, doctor?: Doctor): void {
    if (doctor) {
      // Mode édition
      this.isEditing = true;
      this.currentDoctorId = doctor.id ?? null ;
      this.doctorForm.patchValue({
        name: doctor.name,
        title: doctor.title,
        address: doctor.address
      });
      this.imagePreview = doctor.image;
    } else {
      // Mode ajout
      this.resetForm();
    }
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentDoctorId = null;
    this.doctorForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    
    // Prévisualisation de l'image
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveDoctor(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    const doctorData = new FormData();
    doctorData.append('name', this.doctorForm.get('name')?.value);
    doctorData.append('title', this.doctorForm.get('title')?.value);
    doctorData.append('address', this.doctorForm.get('address')?.value);
    
    if (this.selectedFile) {
      doctorData.append('image', this.selectedFile);
    }

    this.isLoading = true;

    if (this.isEditing && this.currentDoctorId) {
      // Mise à jour
      this.doctorService.updateDoctor(this.currentDoctorId, doctorData).subscribe({
        next: () => {
          this.handleSaveSuccess('Médecin mis à jour avec succès');
        },
        error: (error: any) => this.handleSaveError(error)
      });
    } else {
      // Ajout
      this.doctorService.addDoctor(doctorData).subscribe({
        next: () => {
          this.handleSaveSuccess('Médecin ajouté avec succès');
        },
        error: (error: any) => this.handleSaveError(error)
      });
    }
  }

  private handleSaveSuccess(message: string): void {
    alert(message);
    this.modalService.dismissAll();
    this.loadDoctors();
    this.resetForm();
    this.isLoading = false;
  }

  private handleSaveError(error: any): void {
    console.error('Error saving doctor', error);
    alert('Une erreur est survenue. Veuillez réessayer.');
    this.isLoading = false;
  }

  deleteDoctor(doctor: Doctor): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le médecin ${doctor.name}?`)) {
      this.isLoading = true;
      this.doctorService.deleteDoctor(doctor.id!).subscribe({
        next: () => {
          alert('Médecin supprimé avec succès');
          this.loadDoctors();
        },
        error: (error: any) => {
          console.error('Error deleting doctor', error);
          alert('Une erreur est survenue lors de la suppression');
          this.isLoading = false;
        }
      });
    }
  }

  get filteredDoctors(): Doctor[] {
    return this.doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      doctor.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      doctor.address.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}