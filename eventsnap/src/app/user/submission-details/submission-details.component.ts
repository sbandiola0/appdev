import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-submission-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submission-details.component.html',
  styleUrls: ['./submission-details.component.css']
})
export class SubmissionDetailsComponent implements OnInit {
  submissionData: any;  // This will hold the data for the submission
  imageUrl: string | undefined; // To hold the base64 image data

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,  
    private location: Location,
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id'); // Get event ID from the URL
    const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
    
    console.log('Event ID:', eventId);  // Add log for eventId
    console.log('User ID:', userId);  // Add log for userId
  
    if (eventId && userId) {
      this.fetchSubmissionDetails(userId, +eventId);  // Convert eventId to number and call fetchSubmissionDetails
    } else {
      console.error('User ID or Event ID is missing');
    }
  }

  fetchSubmissionDetails(userId: string, eventId: number): void {
    // Assuming your service method takes eventId and userId to fetch the submission data
    this.apiService.getEventUserHistory(userId, eventId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.submissionData = data[0]; // Get the first item in the array
          
          // If the image is a LONGBLOB, ensure it has the correct format
          if (this.submissionData.image) {
            const imageBase64 = this.submissionData.image;
            // Only add the prefix if it doesn't already exist
            if (!imageBase64.startsWith('data:image/png;base64,')) {
              this.imageUrl = `data:image/png;base64,${imageBase64}`;
            } else {
              this.imageUrl = imageBase64; // Directly use the base64 data if already formatted
            }
          }
        } else {
          console.error('No data found');
        }
      },
      error: (error) => {
        console.error('Error fetching submission details:', error);
        // Handle error, e.g., show an error message or fallback data
      }
    });
  }

  goBack(): void {
    setTimeout(() => {
      this.location.back();
    }, 200);
  }
}
