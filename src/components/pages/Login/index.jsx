/* eslint-disable no-unused-expressions */
import React from 'react';
import { Row, Col, Form, Input, Button, notification, Card } from 'antd';
import { useHistory } from 'react-router-dom';
import '../../../App.css';
import axios from '../../../axios';
import Logo from '../../../images/circle-cropped.png';

const Login = () => {
	let history = useHistory();
	const [form] = Form.useForm();

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
								title="Welcome back!!!"
								bordered={false}
								className="md:w-5/6"
								extra={<a href="/sign-up">New user? Sign Up </a>}
							>
								<Form
									hideRequiredMark
									autoComplete="off"
									name="basic"
									//keep track of what user write in input field
									form={form}
									onFinish={(values) => {
										console.log('values', values);

										async function checkExistingUser() {
											await axios.post('/user/find', values).then((res) => {
												console.log('res', res);
												if (res?.data?.length === 0) {
													console.log(`no data`);
													notification.open({
														message: 'User does not exist!',
														description:
															'User with this username does not exist , please sign up.',
													});
												} else {
													history.push('/products');
												}
											});
										}
										checkExistingUser();

										form?.resetFields();
									}}
								>
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
											Submit
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

export default Login;
