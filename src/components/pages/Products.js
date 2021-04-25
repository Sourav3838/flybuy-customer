import React, { useEffect, useState } from 'react';
import {
	Card,
	Avatar,
	Row,
	Col,
	Tooltip,
	Tag,
	message,
	Carousel,
	Button,
	Popover,
	Result,
	Space,
	Table,
	Input,
	Radio,
	Skeleton,
} from 'antd';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
	EyeOutlined,
	StarTwoTone,
	ShoppingTwoTone,
	PlusCircleOutlined,
	EyeTwoTone,
	UserOutlined,
	FilterTwoTone,
	HeartTwoTone,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import axios from '../../axios';
import '../../App.css';

const Products = ({ currentUser, setCurrentUser, setCartValue, setWishlistValue }) => {
	const { Search } = Input;
	const [productList, setProductList] = useState([]);
	const [textSearch, setTextSearch] = useState('');
	const [userCategory, setUserCategory] = useState('');
	const [skeletonLoading, setSkeletonLoading] = useState(false);
	const [productRetailerList, setProductRetailerList] = useState([]);
	const { userId, retailerId } = useParams();
	const { Meta } = Card;
	const history = useHistory();
	console.log(`productRetailerList`, productRetailerList);
	useEffect(() => {
		async function checkExistingUser() {
			const res = await axios.get(`/user/current/${userId}`);
			console.log(`res`, res);
			if (res?.status === 201) {
				localStorage.setItem('user', JSON.stringify(res?.data[0]));
				setCurrentUser(JSON.parse(localStorage.getItem('user')));
			}
		}
		checkExistingUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function getProducts() {
		console.log(`here`);
		const req = await axios.get(`/product/all/customer?keyword=${textSearch}&userCategory=${userCategory}`);
		if (req) {
			console.log('dsfdhaatujy', req?.data);
			setProductList(req?.data);
			setSkeletonLoading(false);
		}
	}
	async function getCartProducts() {
		console.log(`called`);
		console.log(`cart product`);
		console.log(`currentUser[0]?._id`, currentUser[0]?._id);
		const response = await axios.get(`/user/${JSON.parse(localStorage.getItem('user'))?._id}/cart`);
		if (response) {
			console.log(`setting cart value`);
			setCartValue(response?.data?.length);
		}
	}

	async function getWishlistProducts() {
		console.log(`called`);
		console.log(`wishlist product`);
		console.log(`currentUser[0]?._id`, currentUser[0]?._id);
		const response = await axios.get(`/user/${JSON.parse(localStorage.getItem('user'))?._id}/wishlist`);
		if (response) {
			console.log(`setting wishlist value`);
			setWishlistValue(response?.data?.length);
		}
	}
	async function addToCart(id) {
		console.log(`get cart`);
		const res = await axios.post(`/product/${id}/add/cart`, JSON.parse(localStorage.getItem('user')));
		if (res) {
			if (res?.data?._id) {
				message.success('Product added to cart successfully');
				getCartProducts();
			} else {
				message.error('Simillar product already exist in your cart');
			}
			console.log(`res while adding product to cart`, res);
		}
	}
	async function addToWishlist(id) {
		console.log(`get wishlist`);
		const res = await axios.post(`/product/${id}/add/wishlist`, JSON.parse(localStorage.getItem('user')));
		if (res) {
			if (res?.data?._id) {
				message.success('Product added to wishlist successfully');
				getWishlistProducts();
			} else {
				message.error('Simillar product already exist in your wishlist');
			}
			console.log(`res while adding product to wishlist`, res);
		}
	}

	async function getRetailerProducts() {
		const req = await axios.get(`/product/all/retailer/${userId}`);
		if (req) {
			console.log(`req retailer data`, req);
			setProductRetailerList(req?.data);
		}
	}

	useEffect(() => {
		if (currentUser?.role !== 'retailer') {
			setSkeletonLoading(true);
			console.log(`userCategory`, userCategory);
			getProducts();
		} else getRetailerProducts();
	}, [currentUser, textSearch, userCategory]);
	console.log(`currentUser`, currentUser);
	const columns = [
		{
			title: 'Product Name',
			dataIndex: 'product_name',
			render: (text, record) => <div className="underline text-blue-400">{text}</div>,
		},
		{
			title: 'Price',
			dataIndex: 'product_price',
			render: (text) => <div>INR {text}</div>,
		},

		{
			title: 'Status',
			dataIndex: 'status',
			render: (text) => <div> {text}</div>,
		},
		{
			title: 'Category',
			dataIndex: 'product_category',
			render: (category) => (
				<div className="w-full flex">
					{category.map((item) => {
						let color = item.length === 5 ? 'geekblue' : 'green';
						if (item === 'Children') {
							color = 'volcano';
						}
						if (item === 'Home Accessories') {
							color = 'Yellow';
						}
						return (
							<Tag color={color} key={item}>
								{item.toUpperCase()}
							</Tag>
						);
					})}
				</div>
			),
		},
		{
			key: 'action',
			align: 'right',
			render: (text, record) => (
				<Space size="middle">
					<div
						className="text-blue-400 cursor-pointer"
						onClick={() => history.replace(`/product/${record._id}`)}
					>
						<EyeTwoTone /> View
					</div>
				</Space>
			),
		},
	];

	const options = [
		{ label: 'All', value: 'All' },
		{ label: 'Men', value: 'Men' },
		{ label: 'Women', value: 'Women' },
		{ label: 'Children', value: 'Children' },
		{ label: 'Home Accessories', value: 'Home_Accessories' },
	];

	const content = (
		<div>
			<Radio.Group
				options={options}
				onChange={(val) => {
					console.log(`val`, val.target.value);
					if (val.target.value !== 'All') setUserCategory(val.target.value);
					else setUserCategory('');
				}}
				defaultValue="All"
				optionType="button"
				buttonStyle="solid"
			/>
		</div>
	);
	const debounceSearchProduct = debounce((value) => setTextSearch(value), 500);
	return (
		<div className="bg-white shadow rounded-lg p-6">
			{currentUser?.role !== 'retailer' && (
				<Search
					placeholder="input search text"
					allowClear
					enterButton
					prefix={
						<Popover content={content} title="Filter Products" trigger="click" placement="bottom">
							<FilterTwoTone
								onClick={(e) => {
									e.stopPropagation();
								}}
								className="text-2xl"
								twoToneColor="blue"
							/>
						</Popover>
					}
					size="large"
					onChange={(e) => {
						console.log(`e.target.value`, e.target.value);
						debounceSearchProduct(e.target.value);
					}}
					onSearch={(values) => {
						debounceSearchProduct(values);
						console.log(`values`, values);
					}}
				/>
			)}
			{currentUser?.role !== 'retailer' && productList?.length > 0 ? (
				<Skeleton loading={skeletonLoading}>
					<Row gutter={[24, 24]}>
						{productList?.map((item) => (
							<Col xl={8} lg={10} md={12} sm={24} xs={24}>
								<div className="mx-8 ">
									<Card
										style={{
											width: 300,
											height: 300,
											margin: '10%',
											boxShadow: '10px 14px 18px #00ff66',
										}}
										cover={
											<Carousel autoplay>
												{item?.ImageURLOne?.url && (
													<div>
														<img
															style={{ width: 300, height: 300 }}
															alt="example"
															src={item?.ImageURLOne?.url}
														/>
													</div>
												)}

												{item?.ImageURLTwo?.url && (
													<div>
														<img
															style={{ width: 300, height: 300 }}
															alt="example"
															src={item?.ImageURLTwo?.url}
														/>
													</div>
												)}

												{item?.ImageURLThree?.url && (
													<div>
														<img
															style={{ width: 300, height: 300 }}
															alt="example"
															src={item?.ImageURLThree?.url}
														/>
													</div>
												)}

												{item?.ImageURLFour?.url && (
													<div>
														<img
															style={{ width: 300, height: 300 }}
															alt="example"
															src={item?.ImageURLFour?.url}
														/>
													</div>
												)}

												{item?.ImageURLFive?.url && (
													<div>
														<img
															style={{ width: 300, height: 300 }}
															alt="example"
															src={item?.ImageURLFive?.url}
														/>
													</div>
												)}
											</Carousel>
										}
										actions={[
											<Tooltip title={item?.product_rating}>
												<StarTwoTone key="rating" twoToneColor="yellow" />
											</Tooltip>,
											<HeartTwoTone
												className="text-4xl"
												twoToneColor="red"
												onClick={() => {
													addToWishlist(item?._id);
												}}
												key="whishlist"
											/>,
											<ShoppingTwoTone
												onClick={() => {
													addToCart(item?._id);
												}}
												key="add"
											/>,
											<Link to={`/product/${item?._id}`}>
												<EyeOutlined key="ellipsis" />
											</Link>,
										]}
									>
										<Meta
											avatar={
												<Avatar
													style={{
														color: 'black',
														backgroundColor: '#00ff66',
													}}
												>
													<span className="capitalize">INR {item?.product_price}</span>
												</Avatar>
											}
											title={
												<div className="w-full flex justify-between">
													<div>{item?.product_name}</div>{' '}
													<div>
														{item?.product_category?.map((category) => {
															let color = category.length === 5 ? 'geekblue' : 'green';
															if (category === 'Children') {
																color = 'volcano';
															}
															if (category === 'Home Accessories') {
																color = 'Yellow';
															}
															return (
																<Tag color={color} key={category}>
																	{category.toUpperCase()}
																</Tag>
															);
														})}
													</div>
												</div>
											}
											description={<div className="truncate">{item?.product_description}</div>}
										/>
									</Card>
								</div>
							</Col>
						))}
					</Row>
				</Skeleton>
			) : (
				<>
					{productRetailerList?.length < 1 ? (
						<Result
							status="404"
							title="404"
							subTitle="Sorry, there are no products to display."
							extra={
								<Link to={`/products/add/${userId}`}>
									<Button type="primary">
										Add Products <PlusCircleOutlined />
									</Button>
								</Link>
							}
						/>
					) : (
						<div className=" mt-12 shadow rounded-lg p-4">
							<Table
								onRow={(record, rowIndex) => {
									return {
										onClick: () => {
											console.log('record', record);
										}, // click row
									};
								}}
								scroll={{ x: 400, y: 300 }}
								columns={columns}
								dataSource={productRetailerList}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};
export default Products;
