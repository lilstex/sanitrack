import RoomModel from '../models/room';


const getRoom = async (roomId: any) => {
    try {
        const room = await RoomModel.findById(roomId).populate('detail');
        if(!room) {
            return {
                status: false,
                message: 'Room not found'
            }
        }
        return {
            status: true,
            message: 'Room found',
            data: JSON.parse(JSON.stringify(room.detail))
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: 'Something went wrong when getting the room by ID'
        }
    }
}

export default {
    getRoom,   
};