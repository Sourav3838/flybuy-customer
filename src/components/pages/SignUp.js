/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, notification, Card } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import '../../App.css';
import axios from '../../axios';
import Logo from '../../images/circle-cropped.png';

const SignUp = () => {
	const fetchQueryParams = () => {
		const queryArray = search.split('?')[1].split('&');
		let queryParams = {};
		for (let i = 0; i < queryArray.length; i++) {
			const [key, val] = queryArray[i].split('=');
			queryParams[key] = val ? val : true;
		}
		return queryParams;
	};
	const [queryParams, setQueryParams] = useState();
	let history = useHistory();
	let { search } = useLocation();
	const [form] = Form.useForm();

	useEffect(() => {
		if (search.includes('?')) setQueryParams(fetchQueryParams(search));
	}, []);

	console.log(window.location);
	return (
		<>
			<div className="log-in" style={{ paddingTop: '5rem' }}>
				<Row gutter={[24, 12]} className="px-12">
					<Col xl={12} lg={12} md={12} sm={24} xs={24} className="items-center ">
						<img src={Logo} alt="FlyBuy" style={{ width: '25rem' }} />
					</Col>
					<Col xl={12} lg={12} md={12} sm={24} xs={24}>
						<div className="mt-12 ">
							<Card
								title="Welcome to FlyBuy!!!"
								bordered={false}
								className="md:w-5/6"
								extra={<a href="/log-in">Already a user? Log In </a>}
							>
								<Form
									hideRequiredMark
									name="basic"
									//keep track of what user write in input field
									autoComplete="off"
									form={form}
									onFinish={(values) => {
										console.log('values', values);

										async function checkExistingUser() {
											const req = await axios.post('/user/login', values);
											if (req) {
												console.log('req from deployed database', req);
												if (req?.statusText === 'Created') {
													notification.open({
														message: 'Great Job!',
														description: `New user name:- ${req?.data?.first_name} ${req?.data?.last_name} has been created successfuly`,
													});
													history.push('/log-in');
												}
											}
										}

										if (!queryParams) {
											checkExistingUser();
										} else {
											const data = values;
											data.role = queryParams?.role;
											data.plan = queryParams?.plan;
											data.price = queryParams?.price;
											console.log(`1`, data);
											checkExistingUser();
										}
										form?.resetFields();
									}}
								>
									<Form.Item
										label={<span className="">First Name</span>}
										name="first_name"
										rules={[
											{
												required: true,
												message: 'Please input your first name!',
											},
										]}
									>
										<Input placeholder="Enter your first name" />
									</Form.Item>
									<Form.Item
										label={<span className="">Last Name</span>}
										name="last_name"
										rules={[
											{
												required: true,
												message: 'Please input your last name!',
											},
										]}
									>
										<Input placeholder="Enter your last name" />
									</Form.Item>

									<Form.Item
										label={<span className="">Username</span>}
										name="username"
										rules={[
											{
												required: true,
												message: 'Please input your username!',
											},
										]}
									>
										<Input placeholder="Enter your username" />
									</Form.Item>

									<Form.Item
										label={<span className="">Password</span>}
										name="password"
										rules={[
											{
												required: true,
												message: 'Please input your password!',
											},
										]}
									>
										<Input.Password placeholder="Enter your password" />
									</Form.Item>

									<Form.Item>
										<Button type="primary" onClick={() => form?.submit()}>
											Become a new member
										</Button>
									</Form.Item>
								</Form>
							</Card>
						</div>
					</Col>
				</Row>
			</div>
		</>
	);
};

export default SignUp;
