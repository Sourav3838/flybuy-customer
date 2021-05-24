/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Avatar, Menu, Dropdown, Drawer, notification, Badge, Form, Input, Popover, Divider, Modal } from 'antd';
import { BellFilled, HeartTwoTone, ShoppingTwoTone } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import axios from '../axios';
import classNames from 'classnames';
import './Navbar.css';

function Navbar({ currentUser, setCurrentUser, cartValue, setCartValue, wishlistValue, setWishlistValue }) {
	var user = JSON.parse(localStorage.getItem('user'));
	console.log(user);

	const [click, setClick] = useState(false);
	const [button, setButton] = useState(true);
	const [query, setQuery] = useState('');
	const [visible, setVisible] = useState(false);
	const [displayQueryModel, setDisplayQueryModel] = useState(false);
	const [popUp, setPopUp] = useState(false);
	const [displayQuery, setDisplayQuery] = useState('');
	const [form] = Form?.useForm();
	let history = useHistory();
	async function logoutUser() {
		console.log(`currentUser[0]`, currentUser);
		const req = await axios.post('/user/logout', JSON.parse(localStorage.getItem('user')));

		if (req) {
			setCurrentUser('');
			notification.open({
				message: 'Come back soon!',
				description: `You have been logged out successfuly`,
			});
			history.push('/');
		}
	}

	async function getCartProducts(id) {
		console.log(`cart product`);
		console.log(`currentUser[0]?._id`, id);
		const response = await axios.get(`/user/${id}/cart`);
		if (response) {
			setCartValue(response?.data?.length);
		}
	}
	async function fetchQueries() {
		const response = await axios.get(`/user/${JSON.parse(localStorage.getItem('user'))?._id}/query`);
		if (response) {
			// console.log(`query response`, response);
			setQuery(response?.data);
		}
	}
	console.log(`query bjfnejfekjf3kl2j`, query);
	async function getWishlistProducts(id) {
		console.log(`wishlist product`);
		console.log(`currentUser[0]?._id`, id);
		const response = await axios.get(`/user/${id}/wishlist`);
		if (response) {
			setWishlistValue(response?.data?.length);
		}
	}
	useEffect(() => {
		form?.setFieldsValue({
			first_name: JSON.parse(localStorage.getItem('user'))?.first_name,
			last_name: JSON.parse(localStorage.getItem('user'))?.last_name,
			username: JSON.parse(localStorage.getItem('user'))?.username,
		});

		getCartProducts(JSON.parse(localStorage.getItem('user'))?._id);
		getWishlistProducts(JSON.parse(localStorage.getItem('user'))?._id);
	}, [currentUser]);
	useEffect(() => {
		if (displayQuery?._id) {
			form?.setFieldsValue({
				query: displayQuery?.admin_comment || 'not responded yet',
			});
		}
	}, [displayQuery]);
	const menu = (
		<Menu>
			<Menu.Item
				onClick={() => {
					setVisible(true);
				}}
			>
				User Profile
			</Menu.Item>
			<Menu.Item danger onClick={logoutUser}>
				Log out
			</Menu.Item>
		</Menu>
	);
	const handleClick = () => setClick(!click);
	const closeMobileMenu = () => setClick(false);
	const onClose = () => {
		setVisible(false);
	};
	const content = (
		<div>
			{query?.length > 0 &&
				query?.map((item) => (
					<>
						<div
							className="cursor-pointer"
							onClick={() => {
								setPopUp(false);
								setDisplayQuery(item);
								setDisplayQueryModel(true);
							}}
						>
							<div className="font-bold">{item?.query?.fields?.query?.stringValue}</div>
							<div className="flex">
								<div className="bg-blue-500 rounded-full px-2 mr-2">Personal</div>
								<div
									className={classNames(
										item?.status === 'Open' ? 'bg-yellow-500' : 'bg-green-500',
										'rounded-full px-2'
									)}
								>
									{item?.status}
								</div>
							</div>
						</div>
						<Divider />
					</>
				))}
		</div>
	);
	const showButton = () => {
		if (window.innerWidth <= 960) {
			setButton(false);
		} else {
			setButton(true);
		}
	};

	useEffect(() => {
		showButton();
		fetchQueries();
	}, []);

	window.addEventListener('resize', showButton);

	return (
		<>
			<nav className="navbar">
				<div className="navbar-container">
					<Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
						FlyBuy
					</Link>
					<div className="menu-icon" onClick={handleClick}>
						<i className={click ? 'fas fa-times' : 'fas fa-bars'} />
					</div>

					<ul className={click ? 'nav-menu active' : 'nav-menu'}>
						{currentUser && currentUser?.role !== 'retailer' && (
							<>
								<li className="nav-item">
									<Link
										to={`/order/user/${JSON.parse(localStorage.getItem('user'))?._id}`}
										className="nav-links"
										onClick={closeMobileMenu}
									>
										Orders
									</Link>
								</li>
								<li className="nav-item">
									<Link
										to={`/products/${JSON.parse(localStorage.getItem('user'))?._id}`}
										className="nav-links"
										onClick={closeMobileMenu}
									>
										Products
									</Link>
								</li>
								<li className="nav-item">
									<Link
										to={`/chatbot/${JSON.parse(localStorage.getItem('user'))?._id}`}
										className="nav-links"
										onClick={closeMobileMenu}
									>
										Query
									</Link>
								</li>

								<li className="nav-item">
									<Link
										to={`/user/${JSON.parse(localStorage.getItem('user'))?._id}/cart`}
										className="nav-links"
										onClick={closeMobileMenu}
									>
										<Badge count={cartValue || 0}>
											<ShoppingTwoTone className="text-4xl" twoToneColor="limegreen" />
										</Badge>
									</Link>
								</li>
								<li className="nav-item">
									<Link
										to={`/user/${JSON.parse(localStorage.getItem('user'))?._id}/wishlist`}
										className="nav-links"
										onClick={closeMobileMenu}
									>
										<Badge count={wishlistValue}>
											<HeartTwoTone className="text-4xl" twoToneColor="red" />
										</Badge>
									</Link>
								</li>
							</>
						)}
						{currentUser && currentUser?.role === 'retailer' && (
							<>
								<li className="nav-item">
									<Link
										to={`/products/${JSON.parse(localStorage.getItem('user'))?._id}`}
										className="nav-links"
										onClick={closeMobileMenu}
									>
										Total Orders
									</Link>
								</li>

								<li className="nav-item">
									<Link
										to={`/products/add/${JSON.parse(localStorage.getItem('user'))?._id}`}
										className="nav-links"
										onClick={closeMobileMenu}
									>
										Add Products
									</Link>
								</li>
							</>
						)}

						<li>
							<Link to="/log-in" className="nav-links-mobile" onClick={closeMobileMenu}>
								Log In/Sign Up
							</Link>
						</li>
					</ul>

					{button && (
						<>
							{currentUser ? (
								<>
									<Dropdown overlay={menu}>
										<Avatar
											style={{
												color: 'black',
												backgroundColor: '#00ff66',
											}}
										>
											<span className="capitalize">
												{JSON.parse(localStorage.getItem('user'))?.first_name?.charAt(0)}{' '}
												{JSON.parse(localStorage.getItem('user'))?.last_name?.charAt(0)}
											</span>
										</Avatar>
									</Dropdown>
									<Popover
										visible={popUp && !displayQueryModel}
										placement="bottomLeft"
										title="Queries"
										content={content}
										trigger="click"
									>
										<div
											className="relative flex  items-center "
											onClick={() => {
												setPopUp(!popUp);
											}}
										>
											<div className="px-2 relative cursor-pointer ml-8">
												<span className="border-2 border-white absolute right-2 top-0 flex items-center justify-center h-3 w-3 rounded-full bg-red-700 text-white text-xs font-medium -ml-6 mt-1 mr-3">
													<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 -ml-0 -mt-0" />
													<span className="relative inline-flex rounded-full" />
												</span>
												<div className="flex rounded-full px-2 pt-2 pb-1 bg-gray-100 text-gray-900 items-center mr-2 ">
													<BellFilled className="text-xl text-blue-900 " />
												</div>
											</div>
										</div>
									</Popover>
								</>
							) : (
								<Link to="/log-in">
									<Button buttonStyle="btn--outline">LOG IN/SIGN UP</Button>
								</Link>
							)}
						</>
					)}
				</div>
			</nav>

			<Drawer title="Edit Profile" placement="right" closable={false} onClose={onClose} visible={visible}>
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
						checkExistingUser();

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
						<Input.Password placeholder="Enter your passowrd" />
					</Form.Item>

					<Form.Item>
						<Button type="primary" onClick={() => form?.submit()}>
							Edit
						</Button>
					</Form.Item>
				</Form>
			</Drawer>
			<Modal
				title="User Query"
				visible={displayQueryModel}
				onCancel={() => {
					setDisplayQueryModel(false);
				}}
				footer={null}
			>
				<div className="font-bold">{displayQuery?.query?.fields?.query?.stringValue}</div>
				<div className="flex mb-6">
					<div className="bg-blue-500 rounded-full px-2 mr-2">Personal</div>
					<div
						className={classNames(
							displayQuery?.status === 'Open' ? 'bg-yellow-500' : 'bg-green-500',
							'rounded-full px-2'
						)}
					>
						{displayQuery?.status}
					</div>
				</div>
				<Form hideRequiredMark name="basic" form={form}>
					<Form.Item name="query">
						<Input placeholder="your query resolved by admin" disabled />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}

export default Navbar;
