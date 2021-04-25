import { Button, message } from 'antd';
import React, { useState } from 'react';
import axios from '../../../axios';
import { UploadOutlined } from '@ant-design/icons';

export default function Upload({ setImageURL }) {
	const [fileInputState, setFileInputState] = useState('');
	const [previewSource, setPreviewSource] = useState('');
	const [selectedFile, setSelectedFile] = useState();
	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		previewFile(file);
		setSelectedFile(file);
		setFileInputState(e.target.value);
	};

	const previewFile = (file) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setPreviewSource(reader.result);
		};
	};

	const handleSubmitFile = (e) => {
		console.log('hfkjewhfkj');
		e.preventDefault();
		if (!selectedFile) return;
		const reader = new FileReader();
		reader.readAsDataURL(selectedFile);
		reader.onloadend = () => {
			uploadImage(reader.result);
		};
		reader.onerror = () => {
			console.error('AHHHHHHHH!!');
		};
	};

	const uploadImage = async (base64EncodedImage) => {
		try {
			await axios
				.post('/api/upload', {
					base64EncodedImage,
				})
				.then((res) => {
					console.log(res);
					setImageURL(res?.data);
				});
			setFileInputState('');
			setPreviewSource('');
			message.success('Image uploaded successfuly');
		} catch (err) {
			message.error('Failed image uploading!!');
			console.log(`err`, err);
		}
	};
	return (
		<div className="mb-2">
			<div className="title">Upload an Image</div>
			<form onSubmit={handleSubmitFile} className="form">
				<div className="flex space-between">
					<input
						id="fileInput"
						type="file"
						name="image"
						accept=".jpg ,.png"
						onChange={handleFileInputChange}
						value={fileInputState}
						className="form-input"
					/>
					<Button className="btn" type="primary" onClick={handleSubmitFile}>
						<UploadOutlined /> Upload
					</Button>
				</div>
			</form>
			{previewSource && <img src={previewSource} alt="chosen" style={{ height: '300px' }} />}
		</div>
	);
}
