import { SAVE_MESSAGE } from './types';

export function saveMessage(dataToSubmit) {
	return {
		type: SAVE_MESSAGE,
		payload: dataToSubmit,
	};
}
export function clearMessage(dataToSubmit) {
	return {
		type: SAVE_MESSAGE,
		payload: dataToSubmit,
	};
}