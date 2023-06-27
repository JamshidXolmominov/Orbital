import { Form, message } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginUser } from '../../../apicalls/users';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';

function Login() {
	const dispatch = useDispatch();
	const onFinish = async values => {
		try {
			dispatch(ShowLoading());
			const response = await loginUser(values);
			dispatch(HideLoading());
			if (response.success) {
				message.success(response.success);
				localStorage.setItem('token', response.data);
				window.location.href = '/';
			} else {
				message.error(response.success);
			}
		} catch (error) {
			dispatch(HideLoading());
			message.error(error.message);
		}
	};
	return (
		<div className='flex justify-center items-center h-screen w-screen bg-primary'>
			<div className='card w-400 p-3 bg-white'>
				<div className='flex flex-col'>
					<div className='flex'>
						<h1 className='text-2xl'>
							Kirish <i class='ri-login-circle-line'></i>
						</h1>
					</div>
					<div className='divider'></div>
					<Form layout='vertical' className='mt-2' onFinish={onFinish}>
						<Form.Item name='email' label='Emailingizni kiriting'>
							<input type='text' />
						</Form.Item>
						<Form.Item name='password' label='Parolingizni kiriting'>
							<input type='password' />
						</Form.Item>

						<div className='flex flex-col gap-2'>
							<button type='submit' className='primary-contained-btn mt-2 w-100'>
								Kirish
							</button>
							<Link to='/register' className='underline'>
								Ro'yhatdan o'tmaganmisiz? Ro'yxatdan o'tish
							</Link>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
}

export default Login;
