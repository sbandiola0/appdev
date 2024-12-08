
<?php
require_once "global.php";
require_once 'vendor/autoload.php';


use Firebase\JWT\JWT;
class Post extends GlobalMethods{
    private $pdo;

    public function __construct(\PDO $pdo){
        $this->pdo = $pdo;
    }

    public function executeQuery($sql) {
        $data = array(); // Placeholder for retrieved records
        $errmsg = ""; // Error message
        $code = 0; // Status code
    }

    /**
     * Add a new school with the provided data.
     *
     * @param array|object $data
     *   The data representing the new school.
     *
     * @return array|object
     *   The added school data.
     */

    /**
     * Add a new event with the provided data.
     *
     * @param array|object $data
     *   The data representing the new event.
     *
     * @return array|object
     *   The added event data.
     */


    //  ADMINNNN
    public function login($data) {
        // Extract ID and password from the request data
        $id = isset($data->id) ? $data->id : null;
        $password = isset($data->password) ? $data->password : null;

        // Check if ID and password are provided
        if (!$id || !$password) {
            // Return error response if ID or password is missing
            return array('error' => 'ID and password are required');
        }

        // Perform the authentication logic by querying the database
        // Check if the provided ID and password match any record in the admin_login table
        $stmt = $this->pdo->prepare("SELECT * FROM admin WHERE id = ? AND password = ?");
        $stmt->execute([$id, $password]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($admin) {
            // Admin found, generate a dynamic secret key
    // Generate a dynamic secret key
    $secret_key = bin2hex(random_bytes(32)); // Generate a 32-byte (256-bit) key and convert it to hexadecimal format

    // Define the algorithm
    $algorithm = 'HS256'; // Example algorithm, you can choose the appropriate one based on your requirements

    // Generate JWT token with 1-day expiration
    $payload = array(
        "id" => $admin['id'],
        "exp" => time() + (60 * 60 * 24) // Token expiration time (1 day)
    );
    $jwt = JWT::encode($payload, $secret_key, $algorithm);

    // Return success response with JWT token
    return array('success' => 'Login successful', 'token' => $jwt);
        } else {
            // No admin found with the provided ID and password, return error response
            return array('error' => 'Invalid ID or password');
        }
    }

    public function verify_student($data) {
        // Extract student ID from the request data
        $student_id = isset($data->student_id) ? $data->student_id : null;

        // Check if student ID is provided
        if (!$student_id) {
            // Return error response if student ID is missing
            return array('error' => 'Student ID is required');
        }

        // Perform the verification logic by querying the database
        // Check if the provided student ID exists in the user_table
        $stmt = $this->pdo->prepare("SELECT * FROM user_table WHERE id = ?");
        $stmt->execute([$student_id]);
        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($student) {
            // Student found, return student data
            return $student;
        } else {
            // No student found with the provided ID, return error response
            return array('error' => 'Student not found');
        }
    }

//  USERRRRR

public function deleteUser($data) {
    // Extract student ID from the request data
    $student_id = isset($data->student_id) ? $data->student_id : null;

    // Check if student ID is provided
    if (!$student_id) {
        // Return error response if student ID is missing
        return $this->sendPayload(null, "failed", "Student ID is required", 400);
    }

    // Prepare SQL statement to delete the user
    $sql = "DELETE FROM user_table WHERE student_id = ?";
    try {
        // Execute the SQL statement with provided student ID
        $statement = $this->pdo->prepare($sql);
        $success = $statement->execute([$student_id]);

        if ($success) {
            // Return success response with a 200 status code
            return $this->sendPayload(null, "success", "User deleted successfully.", 200);
        } else {
            // Return failure response with a 400 status code
            return $this->sendPayload(null, "failed", "Failed to delete user.", 400);
        }
    } catch (\PDOException $e) {
        $errmsg = $e->getMessage();
        $code = 400;
        return $this->sendPayload(null, "failed", $errmsg, $code);
    }
}


public function updateUser($data) {
    // Check if required fields are present
    $requiredFields = ['student_id', 'first_name', 'middle_name', 'last_name', 'email', 'program', 'password'];
    foreach ($requiredFields as $field) {
        if (!isset($data->$field)) {
            return $this->sendPayload(null, "failed", "Missing required fields: $field", 400);
        }
    }

    // Prepare SQL statement to update the user
    $sql = "UPDATE user_table SET first_name = ?, middle_name = ?, last_name = ?, email = ?, program = ?, password = ? WHERE student_id = ?";
    try {
        // Execute the SQL statement with provided data
        $statement = $this->pdo->prepare($sql);
        $success = $statement->execute([
            $data->first_name,
            $data->middle_name,
            $data->last_name,
            $data->email,
            $data->program,
            password_hash($data->password, PASSWORD_DEFAULT), // Ensure password is securely hashed
            $data->student_id
        ]);

        if ($success) {
            // Return success response with a 200 status code
            return $this->sendPayload(null, "success", "User updated successfully.", 200);
        } else {
            // Return failure response with a 400 status code
            return $this->sendPayload(null, "failed", "Failed to update user.", 400);
        }
    } catch (\PDOException $e) {
        $errmsg = $e->getMessage();
        $code = 400;
        return $this->sendPayload(null, "failed", $errmsg, $code);
    }
}


// EVENTTTTTT

// public function add_event($data) {
//     $sql = "INSERT INTO events (school_name, event_name, event_date, exclusive_for, event_start_time, event_end_time)
//             VALUES (?, ?, ?, ?, ?, ?)";
//     try {
//         $statement = $this->pdo->prepare($sql);
//         $statement->execute([
//             $data->school_name,
//             $data->event_name,
//             $data->event_date,
//             $data->exclusive_for,
//             $data->event_start_time,
//             $data->event_end_time
//         ]);
//         return $this->sendPayload(null, "success", "Successfully created a new event record.", 200);
//     } catch (\PDOException $e) {
//         $errmsg = $e->getMessage();
//         $code = 400;
//     }
//     return $this->sendPayload(null, "failed", $errmsg, $code);
// }

public function add_event($data) {
    // Prepare SQL statement to insert a new event
    $sql = "INSERT INTO events (school_name, event_name, event_date, exclusive_for, event_start_time, event_end_time, max_participants)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    try {
        $statement = $this->pdo->prepare($sql);
        $statement->execute([
            $data->school_name,
            $data->event_name,
            $data->event_date,
            $data->exclusive_for, // Updated to use exclusive_for
            $data->event_start_time,
            $data->event_end_time,
            $data->max_participants // New field for max participants
        ]);
        return $this->sendPayload(null, "success", "Successfully created a new event record.", 200);
    } catch (\PDOException $e) {
        $errmsg = $e->getMessage();
        $code = 400;
    }
    return $this->sendPayload(null, "failed", $errmsg, $code);
}


public function deleteEvent($data) {
    // Extract event ID from the request data
    $event_id = isset($data->id) ? $data->id : null;

    // Check if event ID is provided
    if (!$event_id) {
        return $this->sendPayload(null, "failed", "Event ID is required", 400);
    }

    // Prepare SQL statement to delete the event
    $sql = "DELETE FROM events WHERE id = ?";
    try {
        $statement = $this->pdo->prepare($sql);
        $success = $statement->execute([$event_id]);

        if ($success) {
            return $this->sendPayload(null, "success", "Event deleted successfully.", 200);
        } else {
            return $this->sendPayload(null, "failed", "Failed to delete event.", 400);
        }
    } catch (\PDOException $e) {
        $errmsg = $e->getMessage();
        $code = 400;
        return $this->sendPayload(null, "failed", $errmsg, $code);
    }
}

// public function updateEvent($data) {
//     $requiredFields = ['id', 'school_name', 'event_name', 'event_date', 'exclusive_for', 'event_start_time', 'event_end_time'];
//     foreach ($requiredFields as $field) {
//         if (!isset($data->$field)) {
//             return $this->sendPayload(null, "failed", "Missing required fields: $field", 400);
//         }
//     }

//     $sql = "UPDATE events SET school_name = ?, event_name = ?, event_date = ?, exclusive_for = ?, event_start_time = ?, event_end_time = ? WHERE id = ?";
//     try {
//         $statement = $this->pdo->prepare($sql);
//         $success = $statement->execute([
//             $data->school_name,
//             $data->event_name,
//             $data->event_date,
//             $data->exclusive_for,
//             $data->event_start_time,
//             $data->event_end_time,
//             $data->id
//         ]);

//         if ($success) {
//             return $this->sendPayload(null, "success", "Event updated successfully.", 200);
//         } else {
//             return $this->sendPayload(null, "failed", "Failed to update event.", 400);
//         }
//     } catch (\PDOException $e) {
//         $errmsg = $e->getMessage();
//         $code = 400;
//         return $this->sendPayload(null, "failed", $errmsg, $code);
//     }
// }

public function updateEvent($data) {
    // Check if required fields are present
    $requiredFields = ['id', 'school_name', 'event_name', 'event_date', 'exclusive_for', 'event_start_time', 'event_end_time', 'max_participants'];
    foreach ($requiredFields as $field) {
        if (!isset($data->$field)) {
            return $this->sendPayload(null, "failed", "Missing required fields: $field", 400);
        }
    }

    // Prepare SQL statement to update the event
    $sql = "UPDATE events SET school_name = ?, event_name = ?, event_date = ?, exclusive_for = ?, event_start_time = ?, event_end_time = ?, max_participants = ? WHERE id = ?";
    try {
        $statement = $this->pdo->prepare($sql);
        $success = $statement->execute([
            $data->school_name,
            $data->event_name,
            $data->event_date,
            $data->exclusive_for, // Updated to use exclusive_for
            $data->event_start_time,
            $data->event_end_time,
            $data->max_participants, // New field for max participants
            $data->id
        ]);

        if ($success) {
            return $this->sendPayload(null, "success", "Event updated successfully.", 200);
        } else {
            return $this->sendPayload(null, "failed", "Failed to update event.", 400);
        }
    } catch (\PDOException $e) {
        $errmsg = $e->getMessage();
        $code = 400;
        return $this->sendPayload(null, "failed", $errmsg, $code);
    }
}


// RECORD ATTENDANCEEEEEEEEEE

public function recordAttendance($data) {
  // Debugging: Log the incoming data
  error_log(print_r($data, true)); // Logs the data for debugging

  // Updated SQL to match the number of values
  $sql = "INSERT INTO attendance (student_id, last_name, first_name, program, event_id, event_name, event_date, timestamp, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  try {
      $timestamp = date('Y-m-d H:i:s');
      $statement = $this->pdo->prepare($sql);
      $success = $statement->execute([
          $data->student_id,
          $data->last_name,
          $data->first_name,
          $data->program,
          $data->event_id,
          $data->event_name,
          $data->event_date,
          $timestamp,
          $data->image
      ]);

      if ($success) {
          return $this->sendPayload(null, "success", "Attendance recorded successfully.", 200);
      } else {
          return $this->sendPayload(null, "failed", "Failed to record attendance.", 400);
      }
  } catch (\PDOException $e) {
      $errmsg = $e->getMessage();
      $code = 400;
      return $this->sendPayload(null, "failed", $errmsg, $code);
  }
}

public function deleteUserAttendance($data) {
    // Extract attendance ID from the request data
    $attendance_id = isset($data->id) ? $data->id : null;

    // Check if attendance ID is provided
    if (!$attendance_id) {
        // Return error response if attendance ID is missing
        return $this->sendPayload(null, "failed", "Attendance ID is required", 400);
    }

    // Prepare SQL statement to delete the user attendance record by ID
    $sql = "DELETE FROM attendance WHERE student_id = ?";
    try {
        // Execute the SQL statement with provided attendance ID
        $statement = $this->pdo->prepare($sql);
        $success = $statement->execute([$attendance_id]);

        if ($success) {
            // Return success response with a 200 status code
            return $this->sendPayload(null, "success", "User attendance record deleted successfully.", 200);
        } else {
            // Return failure response with a 400 status code
            return $this->sendPayload(null, "failed", "Failed to delete user attendance record.", 400);
        }
    } catch (\PDOException $e) {
        $errmsg = $e->getMessage();
        $code = 400;
        return $this->sendPayload(null, "failed", $errmsg, $code);
    }
}


// Approve attendance and move to approved participants

public function approvedAttendance($data) {
  // Enable error reporting for detailed debugging
  error_reporting(E_ALL);
  ini_set('display_errors', 1);

  // Extract attendance ID from the request data
  $attendance_id = isset($data->id) ? $data->id : null;

  // Check if attendance ID is provided
  if (!$attendance_id) {
      return $this->sendPayload(null, "failed", "Attendance ID is required", 400);
  }

  try {
      // Start a database transaction
      $this->pdo->beginTransaction();

      // Get the attendance data first
      $sqlSelect = "SELECT * FROM attendance WHERE id = ?";
      $stmt = $this->pdo->prepare($sqlSelect);
      $stmt->execute([$attendance_id]);
      $attendance = $stmt->fetch(PDO::FETCH_ASSOC);

      // Check if the attendance data exists
      if (!$attendance) {
          throw new \Exception("Attendance record not found");
      }

      // Verify all required fields are present
      $requiredFields = [
          'student_id', 'last_name', 'first_name', 'program', 
          'event_id', 'event_name', 'event_date', 'timestamp', 'image'
      ];
      foreach ($requiredFields as $field) {
          if (!isset($attendance[$field])) {
              throw new \Exception("Missing required field: $field");
          }
      }

      // Insert into approved_participants
      $sqlInsert = "INSERT INTO approved_participants (
          student_id, last_name, first_name, program, 
          event_id, event_name, event_date, timestamp, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      
      $insertStmt = $this->pdo->prepare($sqlInsert);
      $insertSuccess = $insertStmt->execute([
          $attendance['student_id'],
          $attendance['last_name'],
          $attendance['first_name'],
          $attendance['program'],
          $attendance['event_id'],
          $attendance['event_name'],
          $attendance['event_date'],
          $attendance['timestamp'],
          $attendance['image']
      ]);

      if (!$insertSuccess) {
          throw new \Exception("Failed to insert into approved_participants");
      }

      // Delete from original attendance table
      $sqlDelete = "DELETE FROM attendance WHERE id = ?";
      $deleteStmt = $this->pdo->prepare($sqlDelete);
      $deleteStmt->execute([$attendance_id]);

      // Commit the transaction
      $this->pdo->commit();

      // Return success response
      return $this->sendPayload(null, "success", "Attendance approved and moved to approved participants", 200);

  } catch (\Exception $e) {
      // Rollback the transaction in case of any error
      if ($this->pdo->inTransaction()) {
          $this->pdo->rollBack();
      }

      // Log the detailed error
      error_log('Approved Attendance Error: ' . $e->getMessage());
      error_log('Attendance Data: ' . print_r($attendance, true));

      // Return an error response with the specific error message
      return $this->sendPayload(null, "failed", "Error: " . $e->getMessage(), 500);
  }
}


    //  USER LOGIN AND REGISTRATION
    public function loginUser($data) {
        // Extract student_id and password from the request data
        $student_id = isset($data->student_id) ? $data->student_id : null;
        $password = isset($data->password) ? $data->password : null;

        // Check if student_id and password are provided
        if (!$student_id || !$password) {
            return array('error' => 'Student ID and password are required');
        }

        // Query to check if the user exists by student_id
        $stmt = $this->pdo->prepare("SELECT * FROM user_table WHERE student_id = ?");
        $stmt->execute([$student_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // User found, generate a JWT token
            $secret_key = 'your_fixed_secret_key'; // Use a consistent secret key
            $algorithm = 'HS256';
            $payload = array(
                "id" => $user['student_id'],
                "exp" => time() + (60 * 60 * 24) // Token expiration time (1 day)
            );
            $jwt = JWT::encode($payload, $secret_key, $algorithm);

            return array(
                'success' => 'Login successful',
                'token' => $jwt,
                'data' => array(
                    'student_id' => $user['student_id'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'email' => $user['email'],
                    'program' => $user['program']
                )
            );
        } else {
            return array('error' => 'Invalid student ID or password');
        }
    }


    public function registerUser($data) {
        // Check for required fields, including middle_name
        if (!isset($data->student_id) || !isset($data->first_name) || !isset($data->last_name) || !isset($data->middle_name) || !isset($data->email) || !isset($data->program) || !isset($data->password)) {
            return $this->sendPayload(null, "failed", "Missing required fields", 400);
        }

        // Hash the password before saving
        $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);

        // Prepare SQL statement to insert a new user, including middle_name
        $sql = "INSERT INTO user_table (student_id, first_name, last_name, middle_name, email, program, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([
                $data->student_id,
                $data->first_name,
                $data->last_name,
                $data->middle_name, // Include middle_name here
                $data->email,
                $data->program,
                $hashedPassword
            ]);
            return $this->sendPayload(null, "success", "User registered successfully.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "failed", $errmsg, 400);
        }
    }

    
  // Example PHP endpoint
  public function checkEventAttendance($studentId, $eventId) {
    global $pdo;
    $query = "SELECT COUNT(*) as attendance_count 
              FROM attendance 
              WHERE student_id = ? AND event_id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$studentId, $eventId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Return true if the user has already attended, false otherwise
    return $result['attendance_count'] > 0;
}

    public function registerForEvent($data) {
        // Extract data from the request
        $student_id = isset($data->student_id) ? $data->student_id : null;
        $event_id = isset($data->event_id) ? $data->event_id : null;

        // Validate required fields
        if (!$student_id || !$event_id) {
            return $this->sendPayload(null, "failed", "Student ID and Event ID are required", 400);
        }

        // Check if the student is already registered for the event
        $sql = "SELECT * FROM registrants WHERE student_id = ? AND event_id = ?";
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$student_id, $event_id]);
            $existingRegistration = $statement->fetch(PDO::FETCH_ASSOC);

            // If the student is already registered, return the status as "Already Registered"
            if ($existingRegistration) {
                return $this->sendPayload($existingRegistration, "success", "You are already registered for this event.", 200);
            }

            // Fetch additional student data from the database
            $sql = "SELECT first_name, last_name, email, program FROM user_table WHERE student_id = ?";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$student_id]);
            $student = $statement->fetch(PDO::FETCH_ASSOC);

            // Check if student exists
            if (!$student) {
                return $this->sendPayload(null, "failed", "Student not found", 400);
            }

            // Prepare registration data
            $first_name = $student['first_name'];
            $last_name = $student['last_name'];
            $email = $student['email'];
            $program = $student['program'];

            // Prepare SQL statement to insert registration data
            $sql = "INSERT INTO registrants (student_id, event_id, last_name, first_name, email, program, status) 
                    VALUES (?, ?, ?, ?, ?, ?, 'Pending')";
            
            // Execute the SQL statement
            $statement = $this->pdo->prepare($sql);
            $success = $statement->execute([$student_id, $event_id, $last_name, $first_name, $email, $program]);

            if ($success) {
                // Return the new registration data with status "Pending"
                $response = [
                    'student_id' => $student_id,
                    'event_id' => $event_id,
                    'status' => 'Pending'
                ];
                return $this->sendPayload($response, "success", "Registration successful.", 200);
            } else {
                return $this->sendPayload(null, "failed", "Failed to register.", 400);
            }
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "failed", $errmsg, 400);
        }
    }
}
