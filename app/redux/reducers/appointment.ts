import { REPLACE_APPOINTMENT_SERVICES, SYNC_LOCAL_STORAGE_APPOINTMENT } from "@constant/appointment";
import { setValueInLocalStorage, getValueFromLocalStorage } from "@util/webstorage";

const initialState = {
    appointmentServices: []
}
export function appointment(state = initialState, action) {
    switch (action.type) {
        case REPLACE_APPOINTMENT_SERVICES:
            const oldState = state;
            const updatedState = { ...oldState, appointmentServices: action.payload }
            setValueInLocalStorage('appointment', updatedState);
            return updatedState;
        case SYNC_LOCAL_STORAGE_APPOINTMENT:
            const persistedAppoitment: any = getValueFromLocalStorage('appointment');
            return persistedAppoitment || initialState;
        default:
            return state;
    }
}