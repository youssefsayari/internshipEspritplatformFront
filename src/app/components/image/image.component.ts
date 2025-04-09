import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../Services/image.service';
import { Image } from '../../Model/image';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  image: File | null = null;
  imageMin: File | null = null;
  images: Image[] = [];

  constructor(
    private imageService: ImageService
  ) {

  }

  ngOnInit(): void {
    this.fetchImages();
  }

  onFileChange(event: any) {
    this.image = event.target.files[0];
    this.imageMin = null;
    const fr = new FileReader();
    fr.onload = (evento: any) => {
      this.imageMin = evento.target.result;
    };
    if (this.image) {
      fr.readAsDataURL(this.image);
    }
  }

  onUpload(): void {
    if (this.image) {
      this.imageService.upload(this.image).subscribe(
        data => {
          this.fetchImages();
        },
        err => {
          this.reset();
          this.fetchImages();
        }
      );
    }
  }

  reset(): void {
    this.image = null;
    this.imageMin = null;
    const imageInputFile = document.getElementById('image') as HTMLInputElement;
    if (imageInputFile) {
      imageInputFile.value = '';
    }
  }

  fetchImages(): void {
    this.imageService.list().subscribe(
      (images) => {
        this.images = images;
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }

  deleteImage(id: any): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to continue?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        this.imageService.delete(id).subscribe(
          () => {
            this.fetchImages();
            Swal.fire('Image deleted !');
    
          },
          error => {
            console.error('Error deleting image:', error);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Operation canceled', '', 'error');
      }
    });
    
  }
}
