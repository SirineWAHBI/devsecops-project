import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  registrationForm = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ]
  });

  submitted = false;

  onSubmit(): void {
    this.submitted = true;




    // Vérifier les validations Angular
    if (this.registrationForm.invalid) {
      return;
    }

    // Récupérer les données du formulaire
    const user = this.registrationForm.value;

    // Envoyer les données vers Spring Boot
    this.http.post(
      'http://localhost:8082/api/users',
      user
    ).subscribe({

      // Si Spring Boot répond correctement
      next: () => {
        alert('Inscription réussie !');

        // Réinitialiser le formulaire
        this.registrationForm.reset();
        this.submitted = false;
      },

      // Si Spring Boot retourne une erreur
      error: (error) => {
        console.error(error);

        alert(
          error.error || 'Une erreur est survenue lors de l’inscription.'
        );
      }
    });
  }
}
