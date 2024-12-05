import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-image-capture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-capture.component.html',
  styleUrls: ['./image-capture.component.css']
})
export class ImageCaptureComponent {
  @ViewChild('video', { static: true }) videoElement!: ElementRef;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef;

  image: string | null = null;
  userData: any; // Variable to hold user data
  private mediaStream: MediaStream | null = null; // Store the media stream

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.getLoggedInUserData();
    const selectedEvent = JSON.parse(localStorage.getItem('selectedEvent') || 'null');
  
    if (!selectedEvent) {
      console.error('No selected event data found');
      this.router.navigate(['/events']);
      return;
    }
  
    console.log('Selected Event:', selectedEvent);
    this.startVideo();
  }
  

  startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.mediaStream = stream;
      this.videoElement.nativeElement.srcObject = stream;
    }).catch(error => {
      console.error('Error accessing camera:', error);
  
      // Detailed error handling
      switch (error.name) {
        case 'NotAllowedError':
          console.error('Camera access denied by the user.');
          break;
        case 'NotFoundError':
          console.error('No camera device found.');
          break;
        case 'NotReadableError':
          console.error('Camera is already in use by another application.');
          break;
        default:
          console.error('Unknown error accessing the camera:', error);
          break;
      }
    });
  }
  

  stopVideo() {
    // Stop all video tracks to release the camera when no longer needed
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null; // Clear the stream reference
    }
  }

  captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video stream onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image as a Base64 encoded PNG
    this.image = canvas.toDataURL('image/png');

    // Hide video element and show the canvas with the captured image
    video.style.display = 'none';
    canvas.style.display = 'block';

    // Stop the video stream after capturing the image
    this.stopVideo();
  }

  retakeImage() {
    // Reset the image and allow the user to retake it
    this.image = null;
    this.videoElement.nativeElement.style.display = 'block';
    this.canvasElement.nativeElement.style.display = 'none';
    this.startVideo(); // Restart the camera for retaking
  }

  confirmImage() {
    // Retrieve the attendance data from localStorage
    const attendanceData: any = JSON.parse(localStorage.getItem('attendanceData') || '{}');
    const userData = this.userData;
  
    // Ensure the user data exists and is valid
    if (!userData || !userData.id) {
      console.error('User data is missing or invalid:', userData);
      return;
    }
  
    // Attach necessary user information to the attendance data
    attendanceData.student_id = userData.id;
    attendanceData.last_name = localStorage.getItem('userLastName') || '';
    attendanceData.first_name = localStorage.getItem('userFirstName') || '';
    attendanceData.program = userData.course || '';
    attendanceData.image = this.image;
  
    // Retrieve the selected event information from localStorage
    const selectedEvent = JSON.parse(localStorage.getItem('selectedEvent') || 'null');
  
    // Check if selectedEvent exists and contains the required id
    if (!selectedEvent || !selectedEvent.id) {
      console.error('Selected event data is missing or invalid:', selectedEvent);
      return;
    }
  
    // Attach the id and other event details to the attendance data
    attendanceData.event_id = selectedEvent.id;
    attendanceData.event_name = selectedEvent.event_name;
    attendanceData.event_date = selectedEvent.event_date;
  
    // Call API to record attendance with the captured image
    this.apiService.recordAttendance(attendanceData).subscribe(
      response => {
        if (response && response.status?.remarks === 'success') {
          // Navigate to the success page if the attendance was successfully recorded
          this.router.navigate(['/attendance-success']);
        } else {
          console.error('Failed to record attendance with image:', response);
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error recording attendance with image:', error);
        
        // Log the detailed error information
        if (error.error) {
          console.error('Error details:', error.error);
        }
      }
    );
  }
  
  goBack() {
    // Navigate back to the events page if needed
    this.router.navigate(['/events']);
  }

  ngOnDestroy() {
    // Ensure the camera is turned off when the component is destroyed
    this.stopVideo();
  }
}
