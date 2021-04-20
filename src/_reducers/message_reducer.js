import { SAVE_MESSAGE } from '../_actions/types';

export default function (state = { messages: [] }, action) {
	switch (action.type) {
		case SAVE_MESSAGE:
			return {
				...state,
				messages: action.payload === '' ? [] : state.messages.concat(action.payload),
			};
		default:
			return state;
	}
}
