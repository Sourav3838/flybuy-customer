/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import {
	Row,
	Col,
	Button,
	Divider,
	Card,
	Tabs,
	Tag,
	notification,
	Modal,
	Form,
	Input,
	message,
	Collapse,
	Select,
	InputNumber,
	Steps,
	Skeleton,
} from 'antd';

import { useParams, useHistory } from 'react-router-dom';
import '../../../App';
import axios from '../../../axios';
import axiosAPI from 'axios';
import GoogleMap from '../GoogleMap';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';

const ViewProducts = () => {
	const { Step } = Steps;
	const { Meta } = Card;
	const { TextArea } = Input;
	let history = useHistory();
	const { Panel } = Collapse;
	const [form] = Form.useForm();
	const [formLocation] = Form.useForm();
	const [orderData, setOrderData] = useState();
	const [action, setAction] = useState('');
	const [loading, setLoading] = useState(false);
	const [userComment, setUserComment] = useState('');
	const [actionModel, setActionModel] = useState(false);
	useEffect(() => {
		if (orderData) {
			form.setFieldsValue({
				category: orderData?.category,
				success_rate: orderData?.category_success_rate,
				comments: orderData?.admin_status_comment,
				location: orderData?.location,
			});
		}
	}, [orderData]);
	const { orderId } = useParams();
	console.log(`orderData`, orderData);
	async function getOrderData() {
		setLoading(true);
		const req = await axios.get(`/order/${orderId}`);
		if (req) {
			console.log(`data of particular order`, req?.data);

			setOrderData(req?.data[0]);
			setLoading(false);
		}
	}

	const myFunction = () => {
		setTimeout(function () {
			history.replace('/orders/all');
		}, 3000);
	};
	async function addUserComment() {
		const req = await axios.put(`/order/${orderId}/user/comment`, { userComment: userComment });
		if (req) {
			console.log(`review`, req?.data);
			message.success('Thank you, for the review. Hope you like our product!');
			getOrderData();
		}
	}
	async function updateOrder(data) {
		const req = await axios.put(`/order/${orderId}/update`, data);
		if (req) {
			console.log(`data of updated order`, req);
			if (req?.data?.ok === 1) {
				notification.open({
					message: 'Great Job!',
					description: `Order tracking details has been updated successfuly`,
				});
				getOrderData();
			}
		}
	}

	async function verifyOrder(data) {
		const req = await axios.put(`/order/${orderId}/verify`, data);
		if (req) {
			console.log(`data of approved product`, req);
			if (req?.data?.ok === 1) {
				notification.open({
					message: 'Great Job!',
					description: `Order status has been updated successfuly`,
				});
				getOrderData();
				history.replace('/orders/all');
				if (orderData?.status === 'REJECTED') {
					message.info('You will be redirected to all orders in 3 seconds');
					myFunction();
				}
			}
		}
	}

	async function findCoordinates(data) {
		axiosAPI
			.get(
				`https://api.opencagedata.com/geocode/v1/json?q=${data?.location}&key=7d593bbbb9cb4353ab146ab74dd2ff8c`
			)
			.then((response) => {
				console.log(`response`, response);
				const { lat, lng } = response.data.results[0]?.geometry;
				const newData = {};
				newData.latitude = lat;
				newData.longitude = lng;
				newData.category = data?.category;
				newData.location = data?.location;
				newData.category_comment = data?.comments;
				newData.category_success_rate = data?.success_rate;
				updateOrder(newData);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		getOrderData();
	}, [orderId]);

	const getCurrentDeliveryState = () => {
		switch (orderData?.category) {
			case 'Approved':
				return 0;
			case 'Dispatched':
				return 1;
			case 'Delivered':
				return 2;
			default:
				return 2;
		}
	};

	return (
		<Skeleton loading={loading}>
			<div className="bg-gray-100">
				<Row gutter={[24, 12]} className="px-12">
					<Col xl={24} lg={24} md={24} sm={24} xs={24}>
						{orderData && (
							<>
								<div
									className=" mt-12 shadow rounded-lg p-4 flex justify-between"
									style={{
										boxShadow: '10px 14px 18px #00ff66',
									}}
								>
									<div className="font-bold text-lg w-full">#{orderData?._id}</div>
									<div className="flex">
										<div className="w-full flex">
											<Tag color="volcano" key={orderData?.status}>
												{orderData?.status || 'NONE'}
											</Tag>
										</div>
									</div>
								</div>

								<div className="my-4 p-4 flex bg-gray-100 justify-between">
									{orderData?.admin_status_comment && (
										<div className="flex ">
											<div className="bg-blue-800 rounded-full text-gray-100 py-1 px-4 mx-3">
												<i>i</i>
											</div>
											<div className="mx-2">{orderData?.admin_status_comment}</div>
										</div>
									)}
									<div>
										<div className="bg-green-500 rounded-full text-gray-900 py-1 px-4 mx-3">
											<i>INR</i> {orderData?.amount}
										</div>
									</div>
								</div>

								<div className="my-6 shadow rounded-lg">
									<Row gutter={[24, 12]}>
										{orderData?.productsList?.map((item) => (
											<Col xl={8} lg={8} md={8} sm={24} xs={24}>
												<Card
													className="m-3 p-12"
													style={{ width: 300, boxShadow: '10px 14px 18px #00ff66' }}
													hoverable
													cover={
														<img
															style={{ width: 300, height: 300 }}
															alt="example"
															src={item?.product?.ImageURLOne?.secure_url}
														/>
													}
												>
													<Meta title={item?.product?.product_name} />
												</Card>
											</Col>
										))}
									</Row>
								</div>

								{orderData?.status === 'APPROVED' && (
									<>
										<Row gutter={[24, 12]}>
											<Col xl={6} lg={6} md={6} sm={24} xs={24}>
												<div className="ml-4">
													<Steps
														current={getCurrentDeliveryState()}
														percent={parseInt(orderData?.category_success_rate)}
														direction="vertical"
													>
														<Step
															title="Ready"
															description={
																orderData?.category === 'Approved'
																	? orderData?.category_comment
																	: ''
															}
														/>
														<Step
															title="Dispatched"
															description={
																orderData?.category === 'Dispatched'
																	? orderData?.category_comment
																	: ''
															}
														/>
														<Step
															title="Delivered"
															description={
																orderData?.category === 'Delivered'
																	? orderData?.category_comment
																	: ''
															}
														/>
													</Steps>
												</div>
											</Col>
											<Col xl={18} lg={18} md={18} sm={24} xs={24}>
												<GoogleMap
													longitude={orderData?.longitude}
													latitude={orderData?.latitude}
													isMarkerShown={true}
												/>
											</Col>
										</Row>
										{orderData?.category_success_rate === '100' &&
											orderData?.category === 'Delivered' && (
												<div className="mt-4 bg-white rounded shadow p-4">
													<div className="font-bold text-lg">Add Review</div>
													<TextArea
														defaultValue={orderData?.user_comment || ''}
														showCount
														maxLength={500}
														onChange={(e) => {
															setUserComment(e.target.value);
														}}
													/>
													<div className="mt-2">
														<Button
															disabled={orderData?.user_comment}
															type="primary"
															onClick={() => {
																addUserComment();
															}}
														>
															Save
														</Button>
													</div>
												</div>
											)}
									</>
								)}
							</>
						)}
					</Col>
				</Row>
			</div>
		</Skeleton>
	);
};

export default ViewProducts;
