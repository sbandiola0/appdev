
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

}
