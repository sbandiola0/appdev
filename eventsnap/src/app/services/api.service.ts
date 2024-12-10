import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // private baseUrl = 'https://api.eventsnap.online/routes.php?request=';
  private baseUrl = 'http://localhost/appdev/eventsnap/backend_php/api/';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'events').pipe(
      map((response: any) => {
        console.log('Raw Events Response:', response);

        // More flexible response handling
        if (response) {
          // If response is an array, return it directly
          if (Array.isArray(response)) {
            return response;
          }
          
          // If response has data property, return data
          if (response.data && Array.isArray(response.data)) {
            return response.data;
          }
          
          // If response has code 200, try to return data
          if (response.code === 200 && response.data) {
            return response.data;
          }
        }

        // If no events found, return empty array
        console.warn('No events found or unexpected response:', response);
        return [];
      }),
      catchError((error) => {
        console.error('Events Fetch Error:', error);
        // Return an empty array instead of throwing an error
        return of([]);
      })
    );
  }


  getUsers(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'users');
  }

  getAttendance(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'attendance');
  }

  getAttendanceById(eventId: number) {
    return this.http.get(`${this.baseUrl}getAttendanceById/${eventId}`);
  } 

  getRegistrants(eventId: number) {
    return this.http.get(`${this.baseUrl}get-registrants/${eventId}`);
  }    

  updateEvent(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'updateEvent', data);
  }

  addUser(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'addUser', data);
  }

  updateUser(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'updateUser', data);
  }

// Add this method to the ApiService class
getEventParticipantsCount(): Observable<any> {
  return this.http.get<any>(this.baseUrl + 'countEventParticipants');
}

  deleteUser(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'deleteUser', data);
  }

  addEvent(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'addevent', data);
  }

  deleteEvent(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'deleteEvent', data);
  }

  deleteUserAttendance(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'deleteUserAttendance', data);
  }

  userRegister(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'userRegister', data).pipe(
       catchError((error) => {
          console.error("Registration error:", error);
          return throwError(() => new Error('Registration failed'));
       })
    );
 }



  getEventHistory(userId: string): Observable<any[]> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<any[]>(`${this.baseUrl}event-history/${userId}`, { headers }).pipe(
      map((data: any[]) => {
        // Optional: You can process the data here, if needed.
        return data; // Ensure the response contains event history with status field
      }),
      catchError((error) => {
        console.error('Error fetching event history:', error);
        return throwError(() => new Error('Failed to fetch event history'));
      })
    );
  }

  getEventUserHistory(userId: string, eventId: number): Observable<any[]> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<any[]>(`${this.baseUrl}event-user-history/${userId}/${eventId}`, { headers }).pipe(
      map((data: any[]) => {
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching event user history:', error);
        return throwError(() => new Error('Failed to fetch event user history'));
      })
    );
  }

  checkUserEventAttendance(studentId: string, eventId: number): Observable<boolean> {
    const token = localStorage.getItem('userToken');
  
    if (!token) {
      console.error('No authentication token found');
      return of(false);
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // Use query parameters instead of path parameters
    return this.http.get<any>(`${this.baseUrl}check-event-attendance`, {
      headers: headers,
      params: {
        student_id: studentId,
        event_id: eventId.toString()
      }
    }).pipe(
      map(response => {
        return typeof response === 'boolean' ? response : response.hasAttended ?? false;
      }),
      catchError(error => {
        console.error('Error checking attendance:', error);
        return of(false);
      })
    );
  }
  
  

  recordAttendance(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'record-attendance', data);
  }

  approvedAttendance(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'approvedAttendance', data)
  }

  getApprovedParticipants(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'getApprovedParticipants');
  }

  getApprovedParticipantsCount(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'countApprovedParticipants');
  }

  getParticipantsCount(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'countParticipants');
  }

  getUserApprovedAttendance(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}approved_attendance/${userId}`);
  }

  getUserCapturedImage(userId: string, eventId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}get-captured-image/${userId}/${eventId}`);
  }

  registerForEvent(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}registerForEvent`, data).pipe(
      catchError((error) => {
        console.error("Registration error:", error);
        return throwError(() => new Error('Event registration failed'));
      })
    );
  }

  getRegistrationStatus(studentId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getRegistrationStatus?student_id=${studentId}`).pipe(
      catchError((error) => {
        console.error('Error fetching registration status:', error);
        return throwError(() => new Error('Error fetching registration status'));
      })
    );
  }

  updateRegistrantStatus(data: { student_id: number; event_id: number; status: string }) {
    return this.http.post(`${this.baseUrl}updateRegistrantStatus`, data);
  }  
}
