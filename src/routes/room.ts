import { Router } from 'express';
import room from '../controllers/room';
import validate from '../middlewares/validate';
import validator from '../validator/room'

// Create an Express Router
const routes = Router();

// Route for creating room
routes.post(
    "/create-room",
    validate(validator.createRoom),
    room.createRoom
);

// Route for getting all rooms
routes.get(
    "/get-all-rooms",
    room.getAllRooms
);

// Route for getting room by id
routes.get(
    "/get-single-room",
    room.getRoom
);

// Route for updating room
routes.put(
    "/update-room",
    validate(validator.updateRoom),
    room.updateRoom
);

// Route for deleting room
routes.delete(
    "/delete-room",
    validate(validator.deleteRoom),
    room.deleteRoom
);


export default routes;