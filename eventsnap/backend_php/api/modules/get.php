
<?php
require_once "global.php";

class Get extends GlobalMethods {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function executeQuery($sql) {
        $data = array(); // Placeholder for retrieved records
        $errmsg = ""; // Error message
        $code = 0; // Status code

        try {
            $result = $this->pdo->query($sql)->fetchAll();
            if ($result) {
                $data = $result;
                $code = 200; // Success status code
            } else {
                $errmsg = "No records found";
                $code = 404; // Not found status code
            }
        } catch(\PDOException $e) {
            $errmsg = $e->getMessage();
            $code = 403; // Forbidden status code
        }

        return array("code" => $code, "errmsg" => $errmsg, "data" => $data);
    }

    public function get_records($table, $condition = null) {
        $sqlString = "SELECT * FROM $table";
        if ($condition != null) {
            $sqlString .= " WHERE " . $condition;
        }

        return $this->executeQuery($sqlString);
    }

    public function get_events(){
        $response = $this->get_records('events', null);
        return $response;
    }

    public function get_users(){
        $response = $this->get_records('user_table', null);
        return $response;
    }

    public function get_registrants($event_id){
        $stmt = $this->pdo->prepare("SELECT * FROM registrants WHERE event_id = ?");
        $stmt->execute([$event_id]);
        $registrantsRecord = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $registrantsRecord; // Return the fetched records
    }
    // public function get_attendance_by_id($event_id): array {
    //     // Prepare the SQL statement to fetch attendance records
    //     $stmt = $this->pdo->prepare("SELECT * FROM attendance WHERE event_id = ?");
        
    //     // Execute the statement and handle potential execution errors
    //     if (!$stmt->execute([$event_id])) {
    //         $errorInfo = $stmt->errorInfo();
    //         error_log("SQL Error: " . json_encode($errorInfo));
    //         return array('status' => array('remarks' => 'failed', 'message' => 'Database error.'));
    //     }
    
    //     // Fetch the attendance records
    //     $attendanceRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    //     // Encode the LONGBLOB images in base64 format if present
    //     foreach ($attendanceRecords as &$record) {
    //         if (isset($record['image']) && !empty($record['image'])) {
    //             // Ensure the image is a valid binary data before base64 encoding
    //             $encodedImage = base64_encode($record['image']);
    //             if ($encodedImage) { // Make sure the encoding is successful
    //                 $record['image'] = 'data:image/jpeg;base64,' . $encodedImage;
    //             } else {
    //                 $record['image'] = ''; // Default empty string for invalid images
    //             }
    //         } else {
    //             $record['image'] = ''; // Default empty string for records without an image
    //         }
    //     }
    
    //     // Return the attendance records
    //     return array(
    //         'status' => array('remarks' => 'success', 'message' => 'Attendance records fetched successfully.'),
    //         'data' => $attendanceRecords
    //     );
    // }

    public function get_attendance_by_id($event_id): array {
        // Prepare the SQL statement to fetch attendance records
        $stmt = $this->pdo->prepare("SELECT * FROM attendance WHERE event_id = ?");
        
        // Execute the statement and handle potential execution errors
        if (!$stmt->execute([$event_id])) {
            $errorInfo = $stmt->errorInfo();
            error_log("SQL Error: " . json_encode($errorInfo));
            return array('status' => array('remarks' => 'failed', 'message' => 'Database error.'));
        }
    
        // Fetch the attendance records
        $attendanceRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Encode the LONGBLOB images in base64 format if present
        foreach ($attendanceRecords as &$record) {
            if (isset($record['image']) && !empty($record['image'])) {
                // Base64 encode the LONGBLOB image
                $encodedImage = base64_encode($record['image']);
                if ($encodedImage) {
                    $record['image'] = 'data:image/jpeg;base64,' . $encodedImage;
                } else {
                    $record['image'] = ''; // Default empty string for invalid images
                }
            } else {
                $record['image'] = ''; // Default empty string for records without an image
            }
        }
    
        // Return the attendance records
        return array(
            'status' => array('remarks' => 'success', 'message' => 'Attendance records fetched successfully.'),
            'data' => $attendanceRecords
        );
    }
    
    
    
    
    
    
    
    
    public function get_attendance() {
        $sql = "SELECT *, image AS image_url FROM attendance";
        $response = $this->executeQuery($sql);
        return $response;
    }

    public function getUserEventHistory($userId) {
        $stmt = $this->pdo->prepare("SELECT * FROM attendance WHERE student_id = ?");
        $stmt->execute([$userId]);
        $attendanceRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $attendanceRecords; // Return the fetched records
    }


    public function get_approved_participants(){
        $sql = "SELECT *, image AS image_url FROM approved_participants";
        $response = $this->executeQuery($sql);
        return $response;
    }

    public function countApprovedParticipants() {
        $sql = "SELECT event_name, COUNT(*) AS approved_count FROM approved_participants GROUP BY event_name";

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($result) {
                return [
                    "status" => "success",
                    "data" => $result
                ];
            } else {
                return [
                    "status" => "failed",
                    "message" => "No approved participants found."
                ];
            }
        } catch (\PDOException $e) {
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    public function countParticipantsForEvents() {
        // SQL query to count the number of participants for each event
        $sql = "SELECT event_id, COUNT(*) AS participant_count FROM participants GROUP BY event_id";

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($result) {
                // Return the list of events with the count of participants
                return [
                    "status" => "success",
                    "data" => $result  // Return data as an array of event_id and participant counts
                ];
            } else {
                return [
                    "status" => "failed",
                    "message" => "No participants found."
                ];
            }
        } catch (\PDOException $e) {
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }


    public function getUserApprovedAttendance($userId) {
        // Fetch approved attendance for the user from the approved_participants table
        $stmt = $this->pdo->prepare("SELECT * FROM approved_participants WHERE student_id = ?");
        $stmt->execute([$userId]);
        $approvedRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $approvedRecords; // Return the approved attendance records
    }

    // public function getUserAttendanceStatus($userId) {
    //     // Get pending attendance (from the 'attendance' table)
    //     $pendingAttendance = $this->getUserEventHistory($userId); // Using existing function

    //     // Get approved attendance (from the 'approved_participants' table)
    //     $approvedAttendance = $this->getUserApprovedAttendance($userId); // Using existing function

    //     // Combine the results into one response
    //     return [
    //         'pending' => $pendingAttendance,
    //         'approved' => $approvedAttendance
    //     ];
    // }

    public function checkUserEventAttendance($studentId, $eventId) {
        try {
            $sql = "SELECT 1 FROM (
                SELECT student_id, event_id FROM attendance 
                UNION 
                SELECT student_id, event_id FROM approved_participants
            ) combined WHERE student_id = ? AND event_id = ? LIMIT 1";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$studentId, $eventId]);
            return $stmt->fetch() ? true : false;
        } catch (PDOException $e) {
            // Log error or handle appropriately
            return false;
        }
    } 

    public function getRegistrationStatus() {
        // Access student_id directly from the query string
        $student_id = isset($_GET['student_id']) ? $_GET['student_id'] : null;
    
        // Validate required fields
        if (!$student_id) {
            return $this->sendPayload(null, "failed", "Student ID is required", 400);
        }
    
        // Fetch registration status from the database for all events the student is registered for
        $sql = "SELECT event_id, status FROM registrants WHERE student_id = ?";
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$student_id]);
            $registrations = $statement->fetchAll(PDO::FETCH_ASSOC);
    
            // Check if any registration records are found
            if ($registrations) {
                return $this->sendPayload($registrations, "success", "Registration status found.", 200);
            } else {
                return $this->sendPayload(null, "failed", "No registrations found for this student.", 400);
            }
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "failed", $errmsg, 400);
        }
    }    
}
