/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Avatar, Menu, Dropdown, Drawer, notification, Badge, Form, Input } from 'antd';
import { ShoppingTwoTone } from '@ant-design/icons';
import { Link, useHistory, useParams } from 'react-router-dom';
import axios from '../axios';
import './Navbar.css';

function Navbar({ currentUser, setCurrentUser, cartValue, setCartValue }) {
	var user = JSON.parse(localStorage.getItem('user'));
	console.log(user);

	const { userId } = useParams();
	const [click, setClick] = useState(false);
	const [button, setButton] = useState(true);
	const [visible, setVisible] = useState(false);
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
	useEffect(() => {
		getCartProducts(JSON.parse(localStorage.getItem('user'))?._id);
	}, [currentUser]);
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
	const showButton = () => {
		if (window.innerWidth <= 960) {
			setButton(false);
		} else {
			setButton(true);
		}
	};

	useEffect(() => {
		showButton();
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
						<li className="nav-item">
							<Link to="/" className="nav-links" onClick={closeMobileMenu}>
								Home
							</Link>
						</li>
						{currentUser && (
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
										to={`/user/${JSON.parse(localStorage.getItem('user'))?._id}/cart`}
										className="nav-links"
										onClick={closeMobileMenu}
									>
										<Badge count={cartValue}>
											<ShoppingTwoTone className="text-4xl" twoToneColor="#fff" />
										</Badge>
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
		</>
	);
}

export default Navbar;
