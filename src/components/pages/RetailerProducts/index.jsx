/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, notification, Card, InputNumber, Select } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import '../../../App.css';
import axios from '../../../axios';
import UploadImages from '../Upload';

const RetailerProducts = () => {
	let history = useHistory();
	const { retailerId } = useParams();
	console.log(`retailerId`, retailerId);
	const [form] = Form.useForm();
	const [ImageURLOne, setImageURLOne] = useState();
	const [ImageURLTwo, setImageURLTwo] = useState();
	const [ImageURLThree, setImageURLThree] = useState();
	const [ImageURLFour, setImageURLFour] = useState();
	const [ImageURLFive, setImageURLFive] = useState();

	const { Option } = Select;
	const { TextArea } = Input;

	console.log(`ImageURLOne`, ImageURLOne);
	console.log(`ImageURLTwo`, ImageURLTwo);
	console.log(`ImageURLThree`, ImageURLThree);
	console.log(`ImageURLFour`, ImageURLFour);
	console.log(`ImageURLFive`, ImageURLFive);
	return (
		<>
			<div>
				<Row gutter={[24, 12]} className="px-12">
					<Col span={4} />
					<Col xl={18} lg={18} md={18} sm={24} xs={24}>
						<div className="mt-12 ">
							<Card title="Add Product!!!" bordered={false} className="md:w-5/6 rounded-full shadow">
								<Form
									hideRequiredMark
									name="basic"
									autoComplete="off"
									form={form}
									onFinish={(values) => {
										if (
											ImageURLOne ||
											ImageURLTwo ||
											ImageURLThree ||
											ImageURLFour ||
											ImageURLFive
										) {
											console.log('values', values);
											async function createProduct() {
												const req = await axios.post('/product/create', {
													...values,
													ImageURLOne,
													ImageURLTwo,
													ImageURLThree,
													ImageURLFour,
													ImageURLFive,
													role: 'retailer',
													retailerId: retailerId,
													status: 'Pending',
												});
												if (req) {
													console.log('req of products', req);
													if (req?.statusText === 'Created') {
														notification.open({
															message: 'Great Job!',
															description: `New product with ${req?.data?.product_name} has been created successfuly`,
														});
													}
												}
											}
											createProduct();
											history?.replace(`/products/${retailerId}`);
											form?.resetFields();
										} else {
											notification.open({
												message: 'No image uploaded yet!',
												description:
													'Please add atleast one image in order to create a new product.',
											});
										}
									}}
								>
									<Form.Item
										label={<span className="">Product Name</span>}
										name="product_name"
										rules={[
											{
												required: true,
												message: 'Please input the product name!',
											},
										]}
									>
										<Input placeholder="Enter product name" size={'large'} />
									</Form.Item>
									<Row gutter={[24, 12]}>
										<Col xl={12} lg={12} md={12} sm={24} xs={24}>
											<Form.Item
												label={<span className="">Product Price</span>}
												name="product_price"
												rules={[
													{
														required: true,
														message: 'Please input the product price!',
													},
												]}
											>
												<InputNumber
													min="0"
													max="2000"
													step="0.01"
													stringMode
													style={{ width: '100%' }}
													size={'large'}
													formatter={(value) =>
														`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
													}
													parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
												/>
											</Form.Item>
										</Col>
										<Col xl={12} lg={12} md={12} sm={24} xs={24}>
											<Form.Item
												label={<span className="">Product Rating</span>}
												name="product_rating"
											>
												<InputNumber
													min="0"
													max="5"
													step="1"
													stringMode
													style={{ width: '100%' }}
													size={'large'}
													parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
												/>
											</Form.Item>
										</Col>
									</Row>
									<Form.Item
										label={<span className="">Product Category</span>}
										name="product_category"
										rules={[
											{
												required: true,
												message: 'Please input the product category!',
											},
										]}
									>
										<Select
											mode="multiple"
											style={{ width: '100%' }}
											placeholder="select one country"
											defaultValue={['Men']}
											optionLabelProp="label"
										>
											<Option value="Men" label="Men">
												<div className="demo-option-label-item">Men</div>
											</Option>
											<Option value="Women" label="Women">
												<div className="demo-option-label-item">Women</div>
											</Option>
											<Option value="Children" label="Children">
												<div className="demo-option-label-item">Children</div>
											</Option>
											<Option value="Home_Accessories" label="Home Accessories">
												<div className="demo-option-label-item">Home Accessories</div>
											</Option>
										</Select>
									</Form.Item>
									<Form.Item
										label={<span className="">Product Description</span>}
										name="product_description"
										rules={[
											{
												required: true,
												message: 'Please input the product description!',
											},
										]}
									>
										<TextArea
											placeholder="Enter product description"
											autoSize={{ minRows: 2, maxRows: 10 }}
										/>
									</Form.Item>

									<UploadImages setImageURL={setImageURLOne} />
									<UploadImages setImageURL={setImageURLTwo} />
									<UploadImages setImageURL={setImageURLThree} />
									<UploadImages setImageURL={setImageURLFour} />
									<UploadImages setImageURL={setImageURLFive} />
									<Form.Item>
										<Button type="primary" className="mt-4 flex" onClick={() => form?.submit()}>
											Add Product
										</Button>
									</Form.Item>
								</Form>
							</Card>
						</div>
					</Col>
					<Col span={2} />
				</Row>
			</div>
		</>
	);
};

export default RetailerProducts;
