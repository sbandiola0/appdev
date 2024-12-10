<?php
/**
 * API Endpoint Router
 *
 * This PHP script serves as a simple API endpoint router, handling GET and POST requests for specific resources.
 */

// Allow requests from any origin
header('Access-Control-Allow-Origin: *'); 
// Allow specific HTTP methods
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
// Allow specific headers
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization');

header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Respond to preflight request
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization");
    header("Access-Control-Max-Age: 86400");
    header("Content-Length: 0");
    header("Content-Type: application/json");
    http_response_code(200);
    exit;
}

// Include required modules
require_once "./modules/get.php";
require_once "./modules/post.php";
require_once "./config/database.php";

$con = new Connection();
$pdo = $con->connect();

// Initialize Get and Post objects
$get = new Get($pdo);
$post = new Post($pdo);
// Check if 'request' parameter is set in the request
if (isset($_REQUEST['request'])) {
    // Split the request into an array based on '/'
    $request = explode('/', $_REQUEST['request']);
} else {
    // If 'request' parameter is not set, return a 404 response
    echo "Not Found";
    http_response_code(404);
    exit();
}

// Handle requests based on HTTP method
switch ($_SERVER['REQUEST_METHOD']) {
    // Handle GET requests
    case 'GET':
        switch ($request[0]) {
            case 'events':
                echo json_encode($get->get_events());
                break;

            case 'get-registrants':
                if (isset($request[1])) {
                    // Call the method in the Get class
                echo json_encode($get->get_registrants($request[1]));
            } else {
                echo json_encode(array('error' => 'event ID is required.'));
                http_response_code(400); // Bad Request
            }
                break;

            case 'users':
                echo json_encode($get->get_users());
                break;

            case 'attendance':
                echo json_encode($get->get_attendance());
                break;
                
                case 'getAttendanceById':
                    if (isset($request[1]) && !empty($request[1])) {
                        echo json_encode($get->get_attendance_by_id($request[1]));
                    } else {
                        echo json_encode(array(
                            'status' => array('remarks' => 'failed', 'message' => 'Event ID is required.')
                        ));
                        http_response_code(400); // Bad Request
                    }
                    break;
                

            case 'getRegistrationStatus':
                header('Content-Type: application/json');
                echo json_encode($get->getRegistrationStatus());
                break;

                case 'event-history':
                    // Ensure you are getting the user ID from the request
                    if (isset($request[1])) {
                        // Call the method in the Get class
                        echo json_encode($get->getUserEventHistory($request[1])); // Use the new method to get event history
                    } else {
                        echo json_encode(array('error' => 'User ID is required.'));
                        http_response_code(400); // Bad Request
                    }
                    break;

                    case 'event-user-history':
                        // Ensure you are getting both the user ID and event ID from the request
                        if (isset($request[1]) && isset($request[2])) {
                            // Call the method in the Get class to fetch attendance by both userId and eventId
                            echo json_encode($get->getUserEventHistoryForEvent($request[1], $request[2])); // Fetch by both userId and eventId
                        } else {
                            echo json_encode(array('error' => 'User ID and Event ID are required.'));
                            http_response_code(400); // Bad Request
                        }
                        break;

                    case 'getApprovedParticipants':
                        echo json_encode($get->get_approved_participants());
                        break;

                        case 'countApprovedParticipants':
                            echo json_encode($get->countApprovedParticipants());
                            break;


                            case 'approved_attendance':
                                if (isset($request[1])) {
                                    // Call the method to get the user's approved attendance
                                    echo json_encode($get->getUserApprovedAttendance($request[1])); // Fetch approved attendance records
                                } else {
                                    echo json_encode(array('error' => 'User ID is required.'));
                                    http_response_code(400); // Bad Request
                                }
                                break;

                                // case 'user-attendance-status':
                                //     if (isset($request[1])) {
                                //         // Get the user's attendance status (pending + approved)
                                //         echo json_encode($get->getUserAttendanceStatus($request[1])); 
                                //     } else {
                                //         echo json_encode(array('error' => 'User ID is required.'));
                                //         http_response_code(400); // Bad Request
                                //     }
                                //     break;

                                case 'check-event-attendance':
                                    if (isset($_GET['student_id']) && isset($_GET['event_id'])) {
                                        $studentId = $_GET['student_id'];
                                        $eventId = $_GET['event_id'];
                                        echo json_encode($get->checkUserEventAttendance($studentId, $eventId));
                                    } else {
                                        echo json_encode(array('error' => 'Student ID and Event ID are required.'));
                                        http_response_code(400); // Bad Request
                                    }
                                    break;
                            
                                    
                                
                            
                        

            default:
                echo "This is forbidden";
                http_response_code(403);
                break;
        }
        break;

    // Handle POST requests    
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        switch ($request[0]) {
            case 'login':
                echo json_encode($post->login($data));
                break;

            // Add user login functionality
            case 'userLogin':
                echo json_encode($post->loginUser($data));
                break;

            // Add user registration functionality
            case 'userRegister':
                echo json_encode($post->registerUser($data));
                break;

            case 'addevent':
                echo json_encode($post->add_event($data));
                break;

            case 'updateUser':
                echo json_encode($post->updateUser($data));
                break;

            // case 'verify':
            //     $get->processRequest();
            //     break;

            case 'record-attendance':
                echo json_encode($post->recordAttendance($data));
                break;

            // case 'addUser':
            //     echo json_encode($post->addUser($data));
            //     break;

            case 'updateEvent':
                echo json_encode($post->updateEvent($data));
                break;

            case 'deleteUser':
                echo json_encode($post->deleteUser($data));
                break;

            case 'deleteEvent':
                echo json_encode($post->deleteEvent($data));
                break;

            case 'deleteUserAttendance':
                echo json_encode($post->deleteUserAttendance($data));
                break;

            case 'approvedAttendance':
                echo json_encode($post->approvedAttendance($data));
                break;

            case 'registerForEvent':
                echo json_encode($post->registerForEvent($data));
                break;

            case 'updateRegistrantStatus':
                echo json_encode($post->updateRegistrantStatus($data));
                break;

            default:
                echo "This is forbidden";
                http_response_code(403);
                break;
        }
        break;

       

    default:
        echo "Method not available";
        http_response_code(404);
        break;
}