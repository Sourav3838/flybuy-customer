import React, { useEffect } from 'react';
import axios from '../../../../axios';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage, clearMessage } from '../../../../_actions/message_actions';
import Message from './Sections/Message';
import { List, Avatar, notification } from 'antd';
import Card from './Sections/Card';
import { useParams, useHistory } from 'react-router-dom';
import { CommentOutlined, RobotOutlined } from '@ant-design/icons';
function Chatbot() {
	const { userId } = useParams();
	const history = useHistory();
	const dispatch = useDispatch();
	const messagesFromRedux = useSelector((state) => state.message.messages);

	useEffect(() => {
		dispatch(clearMessage(''));
		var msg = new SpeechSynthesisUtterance('hello, how can i help');
		window.speechSynthesis.speak(msg);
		eventQuery('flybuy-chat-bot');
	}, [userId]);

	const textQuery = async (text) => {
		//  First  Need to  take care of the message I sent
		let conversation = {
			who: 'user',
			content: {
				text: {
					text: text,
				},
			},
		};

		dispatch(saveMessage(conversation));
		// console.log('text I sent', conversation)

		// We need to take care of the message Chatbot sent
		const textQueryVariables = {
			text,
		};
		try {
			//I will send request to the textQuery ROUTE
			const response = await axios.post(`/api/dialogflow/textQuery/${userId}`, textQueryVariables);

			for (let content of response.data.fulfillmentMessages) {
				conversation = {
					who: 'bot',
					content: content,
				};

				var msg = new SpeechSynthesisUtterance(content.text.text);
				window.speechSynthesis.speak(msg);

				dispatch(saveMessage(conversation));
				setTimeout(() => {
					if (response.status === 200 && content.text.text[0].includes('Thank you')) {
						notification.open({
							message: 'Query is saved successfully',
							description: `Please wait for the response, admin will get back to you soon`,
						});
						history.push(`/products/${userId}`);
					}
				}, 8000);
			}
		} catch (error) {
			conversation = {
				who: 'bot',
				content: {
					text: {
						text: ' Error just occured, please check the problem',
					},
				},
			};

			dispatch(saveMessage(conversation));
		}
	};

	const eventQuery = async (event) => {
		// We need to take care of the message Chatbot sent
		const eventQueryVariables = {
			event,
		};
		try {
			//I will send request to the textQuery ROUTE

			const response = await axios.post(`/api/dialogflow/eventQuery/${userId}`, eventQueryVariables);

			for (let content of response.data.fulfillmentMessages) {
				let conversation = {
					who: 'bot',
					content: content,
				};

				dispatch(saveMessage(conversation));
			}
		} catch (error) {
			let conversation = {
				who: 'bot',
				content: {
					text: {
						text: ' Error just occured, please check the problem',
					},
				},
			};
			dispatch(saveMessage(conversation));
		}
	};

	const keyPressHanlder = (e) => {
		if (e.key === 'Enter') {
			if (!e.target.value) {
				return alert('you need to type somthing first');
			}

			//we will send request to text query route
			textQuery(e.target.value);

			e.target.value = '';
		}
	};

	const renderCards = (cards) => {
		return cards.map((card, i) => <Card key={i} cardInfo={card.structValue} />);
	};

	const renderOneMessage = (message, i) => {
		console.log('message', message);

		// we need to give some condition here to separate message kinds

		// template for normal text
		if (message && message.content && message.content.text && message.content.text.text) {
			return <Message key={i} who={message.who} text={message.content.text.text} />;
		} else if (message && message.content && message.content.payload.fields.card) {
			const AvatarSrc = message.who === 'bot' ? <RobotOutlined /> : <CommentOutlined />;

			return (
				<div>
					<List.Item style={{ padding: '1rem' }}>
						<List.Item.Meta
							avatar={<Avatar icon={AvatarSrc} />}
							title={message.who}
							description={renderCards(message.content.payload.fields.card.listValue.values)}
						/>
					</List.Item>
				</div>
			);
		}

		// template for card message
	};

	const renderMessage = (returnedMessages) => {
		if (returnedMessages) {
			return returnedMessages.map((message, i) => {
				return renderOneMessage(message, i);
			});
		} else {
			return null;
		}
	};

	return (
		<div
			style={{
				height: 400,
				width: 700,
				border: '3px solid black',
				borderRadius: '7px',
			}}
		>
			<div style={{ height: 340, width: '100%', overflow: 'auto' }}>{renderMessage(messagesFromRedux)}</div>
			<input
				style={{
					margin: 0,
					width: '100%',
					height: 50,
					borderRadius: '4px',
					padding: '5px',
					fontSize: '1rem',
				}}
				placeholder="Send a message..."
				onKeyPress={keyPressHanlder}
				type="text"
			/>
		</div>
	);
}

export default Chatbot;
